/** @format */
import {Black_Value, BOARD_SIZE, Player, White_Value} from "../const";

class Game {
	private best: number[][] = [];
	private level: number = 3;
	// u = board
	evaluate = (u: number[][]) => {
		let res = 0;

		for (let i = 0; i < 5; i++) {
			for (let j = 0; j < 5; j++) {
				if (u[i][j] === Player.COMPUTER) {
					res += White_Value[i][j];
					// console.log(i, j);

					if (u[i][j - 1] === Player.USER && j - 1 >= 1) {
						res += 40;
					}
					if (u[i][j - 2] === Player.USER && j - 2 >= 1) {
						//Chặn gián tiếp

						res += 30;
					}
				}
				if (u[i][j] === Player.USER) {
					res += Black_Value[i][j];
					//Chặn trực tiếp
					if (i + 1 < 4 && u[i + 1][j] === Player.COMPUTER) {
						res -= 40;
					}
					if (i + 2 < 4 && u[i + 2][j] === Player.COMPUTER) {
						//Chặn gián tiếp
						res -= 30;
					}
				}
			}
		}
		return res;
	};
	//tìm tất cả các trường hợp của Min Hoặc Max có thể đi trong một board

	getLegalMoves(u: number[][], player: Player) {
		const listLegalMove: number[][][] = [];

		if (player === Player.COMPUTER) {
			for (let i = 0; i < BOARD_SIZE; i++) {
				for (let j = 0; j < BOARD_SIZE; j++) {
					if (u[i][j] === Player.COMPUTER && i !== 0) {
						// sang phai
						if (j + 1 < BOARD_SIZE && u[i][j + 1] === 0) {
							const newValue = JSON.parse(JSON.stringify(u));
							newValue[i][j + 1] = Player.COMPUTER;
							newValue[i][j] = 0;
							listLegalMove.push(newValue);
						}
						// sang trai
						if (j - 1 >= 0 && u[i][j - 1] === 0) {
							const newValue = JSON.parse(JSON.stringify(u));
							newValue[i][j - 1] = Player.COMPUTER;
							newValue[i][j] = 0;
							listLegalMove.push(newValue);
						}
						//len tren
						if (i - 1 >= 0 && (u[i - 1][j] === 0 || u[i - 1][j] === 2)) {
							const newValue = JSON.parse(JSON.stringify(u));
							newValue[i - 1][j] = Player.COMPUTER;
							newValue[i][j] = 0;
							listLegalMove.push(newValue);
						}
					}
				}
			}
		} else {
			for (let i = 0; i < BOARD_SIZE; i++) {
				for (let j = 0; j < BOARD_SIZE; j++) {
					if (u[i][j] === Player.USER && j !== BOARD_SIZE - 1) {
						// sang phai
						if (
							j + 1 < BOARD_SIZE &&
							(u[i][j + 1] === 0 || u[i][j + 1] === 2)
						) {
							const newValue = JSON.parse(JSON.stringify(u));
							newValue[i][j + 1] = Player.USER;
							newValue[i][j] = 0;
							listLegalMove.push(newValue);
						}
						// xuong duoi
						if (i + 1 < BOARD_SIZE && u[i + 1][j] === 0) {
							const newValue = JSON.parse(JSON.stringify(u));
							newValue[i + 1][j] = Player.USER;
							newValue[i][j] = 0;
							listLegalMove.push(newValue);
						}
						// len tren
						if (i - 1 >= 0 && u[i - 1][j] === 0) {
							const newValue = JSON.parse(JSON.stringify(u));
							newValue[i - 1][j] = Player.USER;
							newValue[i][j] = 0;
							listLegalMove.push(newValue);
						}
					}
				}
			}
		}

		return listLegalMove;
	}
	// Computer
	maxVal = (u: number[][], h: number, alpha: number, beta: number): number => {
		// check h = 0  và u là đỉnh kết thúc ( code thầy )
		if (h === 0 || this.getLegalMoves(u, Player.COMPUTER).length === 0) {
			// maxVal = eval(u) => eval === evaluate
			return this.evaluate(u);
		}
		for (const move of this.getLegalMoves(u, Player.COMPUTER)) {
			// maxVal = alpha
			alpha = Math.max(alpha, this.minVal(move, h - 1, alpha, beta));
			// cắt bỏ cây con
			if (alpha > beta) {
				break;
			}
		}

		return alpha;
	};
	// User
	minVal = (u: number[][], h: number, alpha: number, beta: number): number => {
		// check h = 0  và u là đỉnh kết thúc ( code thầy )
		if (h === 0 || this.getLegalMoves(u, Player.USER).length === 0) {
			// minVal = eval(u) => eval === evaluate
			return this.evaluate(u);
		}
		for (const move of this.getLegalMoves(u, Player.USER)) {
			// minVal = beta
			beta = Math.min(beta, this.maxVal(move, h - 1, alpha, beta));
			// cắt bỏ cây con
			if (alpha > beta) {
				break;
			}
		}
		return beta;
	};

	//h: độ sâu, maximizingPlayer: quân đỏ(max - computer)
	miniMax = (
		node: number[][],
		h: number,
		maximizingPlayer: Player,
		alpha: number,
		beta: number
	) => {
		let val = -99999;
		// cây trò chơi có thể đi được của computer
		// code thầy, xem lại slide
		for (const move of this.getLegalMoves(node, Player.COMPUTER)) {
			const minVal = this.minVal(move, h - 1, alpha, beta);
			if (val <= minVal) {
				this.best = move;
				val = minVal;
			}
		}
	};

	isWinning = (player: Player): Player | null => {
		const move = this.best;

		let userWin: Player | null = null;
		let count = 0;

		for (let i = 0; i < BOARD_SIZE; i++) {
			if (move[0][i] === player && player === Player.COMPUTER) {
				count++;
			}

			if (move[i][4] === player && player === Player.USER) {
				count++;
			}
		}

		if (count === 2) {
			userWin = player;
		}

		return userWin;
	};

	getBestMovePoint(
		u: number[][],
		player: Player,
		callback: (userWin: Player | null) => void
	) {
		this.best = [];
		this.miniMax(u, this.level, Player.COMPUTER, -10000, 10000);
		callback(this.isWinning(player));
		return this.best;
	}

	setLevel = (level: number) => {
		this.level = level;
	};
}

export const game = new Game();
