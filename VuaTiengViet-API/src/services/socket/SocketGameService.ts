import Application from '@/app';
import { GameConstants } from '@/constants/GameConstants';
import { GameEvents } from '@/constants/GameEvents';
import { Game } from '@/entities/Game';
import ISocketGameService from '@/interfaces/ISocketGameService';
import PrismaService from '@/services/database/PrismaService';
import { checkGameLetters, shuffleLetter } from '@/utils/handleWord';
import schedule from 'node-schedule';
import { Server, Socket } from 'socket.io';

class SocketGameService implements ISocketGameService {
    private socketServer: Server;
    private _context: PrismaService;
    private onlinePlayers: Array<Player> = [];
    private Games: Array<Game> = [];
    private matchmakingQueue: Set<string> = new Set();

    constructor(Application: Application, PrismaService: PrismaService) {
        this.socketServer = Application.socketServer;
        this._context = PrismaService;
        this.initGameService();
    }

    private initGameService = () => {
        this.socketServer.on(GameEvents.CONNECTION, this.onSocketConnect);
        this.initScheduler();
    };

    private onSocketConnect = (socket: Socket) => {
        this.socketServer.emit(GameEvents.USER_CONNECTED, { id: socket.id });
        socket.on(GameEvents.DISCONNECT, () => this.onDisconnect(socket));
        socket.on(GameEvents.PLAYER_JOIN, (player: Player) =>
            this.onPlayerJoin(player, socket)
        );
        socket.on(GameEvents.FIND_OPPONENT, () => this.onFindOpponent(socket));
        socket.on(GameEvents.STOP_FIND_OPPONENT, () =>
            this.onStopFindOpponent(socket)
        );
        socket.on(GameEvents.GAME_START, (gameId: string) =>
            this.onGameStart(gameId)
        );
        socket.on(
            GameEvents.WORD_SUBMIT,
            (data: { gameId: string; wordId: string; letters: Array<string> }) =>
                this.onWordSubmit(data, socket)
        );
        socket.on(GameEvents.CONFIRM_GAME_RESULT, (gameId: string) =>
            this.onConfirmGameResult(gameId)
        );
        socket.on(GameEvents.EXIT_GAME, (gameId: string) =>
            this.onExitGame(gameId, socket)
        );
    };

    onDisconnect = (socket: Socket) => {
        const player = this.onlinePlayers.find(
            (player) => player.socketId === socket.id
        );
        if (!player) return;
        this.matchmakingQueue.delete(socket.id);
        this.onlinePlayers = this.onlinePlayers.filter(
            (player) => player.socketId !== socket.id
        );
        const game = this.Games.find((game) =>
            game.players.some((p) => p.id === player.id)
        );
        if (!game) return;
        game.players = game.players.filter((p) => p.id !== player.id);
        if (game.players.length === 0) {
            this.Games = this.Games.filter((g) => g.gameId !== game.gameId);
        }
        if (game.players.length === 1) {
            const winner = game.players[0];
            const winnerSocket = this.socketServer.sockets.sockets.get(
                winner.socketId
            );
            winnerSocket.emit(GameEvents.GAME_FINISH, {
                gameId: game.gameId,
                winner: winner,
                message: `Opponent disconnected, ${winner.playerName} wins!`,
            });
            const winnerPlayer = this.onlinePlayers.find(
                (player) => player.id === winner.id
            );
            if (winnerPlayer) {
                winnerPlayer.isPlaying = false;
            }
            this.onConfirmGameResult(game.gameId);
        }
    };

    private onPlayerJoin = (player: Player, socket: Socket) => {
        const existedPlayer = this.onlinePlayers.find(
            (p) => p.id === player.id && p.socketId === socket.id
        );
        if (existedPlayer) return;
        this.onlinePlayers.push({
            ...player,
            socketId: socket.id,
            isPending: false,
            isPlaying: false,
        });
        socket.emit(GameEvents.PLAYER_JOIN, { ...player, socketId: socket.id });
    };

    private onFindOpponent = (socket: Socket) => {
        const player = this.onlinePlayers.find(
            (player) => player.socketId === socket.id
        );

        if (!player) {
            socket.emit(GameEvents.GAME_ERROR, {
                message: 'Player not found',
            });
            return;
        }

        if (player.isPlaying) {
            socket.emit(GameEvents.GAME_ERROR, {
                message: 'You are already in a game',
            });
            return;
        }

        // Add to matchmaking queue and update player state atomically
        this.matchmakingQueue.add(socket.id);
        player.isPending = true;
    };

    private onStopFindOpponent = (socket: Socket) => {
        const player = this.onlinePlayers.find(
            (player) => player.socketId === socket.id
        );
        if (!player) return;

        // Remove from matchmaking queue and update state atomically
        this.matchmakingQueue.delete(socket.id);
        player.isPending = false;
    };

    private onGameStart = async (gameId: string) => {
        try {
            const game = this.Games.find((game) => game.gameId === gameId);
            if (!game || game?.isPlaying) return;
            const players = game.players.map((player) =>
                this.onlinePlayers.find((p) => p.id === player.id)
            );
            players.forEach((player) => {
                player.isPlaying = true;
            });
            game.isPlaying = true;
            await game.initWords(this._context);
            const firstWordLetters = shuffleLetter(game.words[0].text);

            this.socketServer.to(game.gameId).emit(GameEvents.GAME_STARTED, {
                gameId: game.gameId,
                wordId: game.words[0].id,
                wordLetters: firstWordLetters,
            });

            setTimeout(() => {
                if (game.gameResults.length === 0) {
                    this.socketServer.to(game.gameId).emit(GameEvents.GAME_TIME_END, {
                        gameId: game.gameId,
                        winner: null,
                        message: 'This game has ended in a draw',
                    });
                } else {
                    const maxCorrectWords = Math.max(
                        ...game.gameResults.map((result) => result.correctWordIds.length)
                    );
                    const winnersResults = game.gameResults.filter(
                        (result) => result.correctWordIds.length === maxCorrectWords
                    );

                    if (winnersResults.length > 1 && maxCorrectWords > 0) {
                        this.socketServer.to(game.gameId).emit(GameEvents.GAME_TIME_END, {
                            gameId: game.gameId,
                            winner: null,
                            message: `This game has ended in a draw with ${maxCorrectWords} correct words`,
                        });
                    } else if (winnersResults.length === 1) {
                        const winner = game.players.find(
                            (player) => player.id === winnersResults[0].playerId
                        );
                        this.socketServer.to(game.gameId).emit(GameEvents.GAME_TIME_END, {
                            gameId: game.gameId,
                            winner: winner,
                            message: `${winner?.playerName} has won the game with ${maxCorrectWords} correct words`,
                        });
                    } else {
                        this.socketServer.to(game.gameId).emit(GameEvents.GAME_TIME_END, {
                            gameId: game.gameId,
                            winner: null,
                            message: 'This game has ended in a draw',
                        });
                    }
                }

                game.isPlaying = false;
                this.onConfirmGameResult(game.gameId);
            }, (GameConstants.GAME_TIME + 1) * 1000);
        } catch (error) {
            console.log(error);
            this.socketServer.to(gameId).emit(GameEvents.GAME_ERROR, {
                message: 'An error occurred while starting the game',
            });
        }
    };

    private onWordSubmit = ( data: { gameId: string; wordId: string; letters: Array<string> }, socket: Socket) => {
        try {
            const game = this.Games.find((game) => game.gameId === data?.gameId);
            if (!game || game.isFinished) {
                socket.emit(GameEvents.GAME_ERROR, {
                    message: 'Game not found or already finished',
                });
                return;
            }
            const player = game.players.find(
                (player) => player.socketId === socket.id
            );
            if (!player) {
                socket.emit(GameEvents.GAME_ERROR, {
                    message: 'Player not found',
                });
                return;
            }
            const originWord = game.words.find((word) => word.id === data.wordId);
            if (!originWord) {
                socket.emit(GameEvents.GAME_ERROR, {
                    message: 'Word not found',
                });
                return;
            }
            const resultLetters = checkGameLetters(originWord.text, data.letters);
            const isCorrect = resultLetters.every((letter) => letter.isMatched);

            // Check if the word is correct
            if (!isCorrect) {
                socket.emit(GameEvents.WORD_SUBMIT_RESULT, {
                    wordId: originWord.id,
                    isCorrect: isCorrect,
                    letters: resultLetters,
                });
                return;
            }

            let gameResult = game.gameResults.find(
                (result) =>
                    result.playerId === player.id && result.gameId === game.gameId
            );

            if (gameResult) {
                gameResult?.correctWordIds.push(originWord.id);
            } else {
                game.gameResults.push({
                    gameId: game.gameId,
                    playerId: player.id,
                    correctWordIds: [originWord.id],
                });
                gameResult = game.gameResults.find(
                    (result) =>
                        result.playerId === player.id && result.gameId === game.gameId
                );
            }

            // Check if player has completed all the words
            if (gameResult?.correctWordIds.length === game.gameWordCount) {
                game.isFinished = true;
                this.socketServer.to(game.gameId).emit(GameEvents.GAME_FINISH, {
                    gameId: game.gameId,
                    winner: player,
                    message: `${player.playerName} won the game!`,
                });
                this.onConfirmGameResult(game.gameId);
                return;
            }
            const nextWord = game.words[gameResult?.correctWordIds?.length + 1];
            const nextWordLetters = shuffleLetter(nextWord?.text);
            socket.emit(GameEvents.WORD_SUBMIT_RESULT, {
                wordId: originWord.id,
                isCorrect: isCorrect,
                letters: resultLetters,
            });
            this.socketServer
                .to(game.gameId)
                .emit(GameEvents.CORRECT_WORD, { ...game?.gameResults });
            socket.emit(GameEvents.SET_NEXT_WORD, {
                wordId: nextWord.id,
                wordLetters: nextWordLetters,
            });
        } catch (error) {
            console.log(error);
            socket.emit(GameEvents.GAME_ERROR, {
                message: 'An error occurred while submitting the word',
            });
        }
    };

    onExitGame = (gameId: string, socket: Socket) => {
        try {
            const game = this.Games.find((game) => game.gameId === gameId);
            const player = this.onlinePlayers.find(
                (player) => player.socketId === socket.id
            );
            player.isPlaying = false;
            if (!game) {
                socket.emit(GameEvents.GAME_ERROR, {
                    message: 'Game not found',
                });
                return;
            }
            const gamePlayer = game.players.find(
                (player) => player.socketId === socket.id
            );
            if (!gamePlayer) {
                socket.emit(GameEvents.GAME_ERROR, {
                    message: 'Player not found in game',
                });
                return;
            }
            game.players = game.players.filter(
                (player) => player.id !== gamePlayer.id
            );
            if (game.players.length === 0) {
                this.Games = this.Games.filter((game) => game.gameId !== gameId);
            }
            if (game.players.length === 1) {
                const winner = game.players[0];
                const winnerSocket = this.socketServer.sockets.sockets.get(
                    winner.socketId
                );
                winnerSocket.emit(GameEvents.GAME_FINISH, {
                    gameId: game.gameId,
                    winner: winner,
                    message: `Opponent disconnected, ${winner.playerName} wins!`,
                });
                const winnerPlayer = this.onlinePlayers.find(
                    (player) => player.id === winner.id
                );
                if (winnerPlayer) {
                    winnerPlayer.isPlaying = false;
                }
                this.onConfirmGameResult(game.gameId);
            }
            socket.leave(game.gameId);
        } catch (error) {
            console.log(error);
            socket.leave(gameId);
            socket.emit(GameEvents.GAME_ERROR, {
                message: 'An error occurred while exiting the game',
            });
        }
    };
    onConfirmGameResult = (gameId: string) => {
        const game = this.Games.find((game) => game.gameId === gameId);
        if (!game) return;
        const gamePlayers = game.players;
        const players = gamePlayers.map((player) =>
            this.onlinePlayers.find((p) => p.id === player.id)
        );
        players.forEach((player) => {
            player.isPlaying = false;
            player.isPending = false;
        });
        const sockets = players.map((player) =>
            this.socketServer.sockets.sockets.get(player.socketId)
        );
        sockets.forEach((socket) => {
            socket.leave(game.gameId);
        });
        this.Games = this.Games.filter((game) => game.gameId !== gameId);
    };

    private gameInit = (firstPlayer: Player, secondaryPlayer: Player): Game => {
        firstPlayer.isPending = false;
        secondaryPlayer.isPending = false;
        const game = new Game();
        game.players.push(firstPlayer, secondaryPlayer);
        this.Games.push(game);
        return game;
    };

    private matchingPlayers = () => {

        if (this.matchmakingQueue.size < 2) return;

        // Convert queue to array for matching
        let queuedSocketIds = Array.from(this.matchmakingQueue);
        const shuffleArray = (array: string[]) => {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        };
        queuedSocketIds = shuffleArray(queuedSocketIds);
        // Match players in pairs
        for (let i = 0; i < queuedSocketIds.length - 1; i += 2) {
            const firstSocketId = queuedSocketIds[i];
            const secondSocketId = queuedSocketIds[i + 1];

            const firstPlayer = this.onlinePlayers.find(
                (p) => p.socketId === firstSocketId
            );
            const secondPlayer = this.onlinePlayers.find(
                (p) => p.socketId === secondSocketId
            );

            if (!firstPlayer || !secondPlayer) continue;

            // Remove both players from queue
            this.matchmakingQueue.delete(firstSocketId);
            this.matchmakingQueue.delete(secondSocketId);

            // Create and initialize game
            const newGame = this.gameInit(firstPlayer, secondPlayer);

            // Join socket room
            const sockets = [
                this.socketServer.sockets.sockets.get(firstSocketId),
                this.socketServer.sockets.sockets.get(secondSocketId),
            ];

            sockets.forEach((socket) => {
                if (socket) socket.join(newGame.gameId);
            });

            // Notify players
            this.socketServer.to(newGame.gameId).emit(GameEvents.OPPONENT_FOUND, {
                gameId: newGame.gameId,
                players: newGame.players,
            });
        }
    };

    private initScheduler = () => {
        const INTERVAL_TIME = '*/3 * * * * *';
        // Run the matchingPlayers function every 3 seconds
        schedule.scheduleJob(INTERVAL_TIME, this.matchingPlayers);
    };
}

export default SocketGameService;
