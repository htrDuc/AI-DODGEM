/** @format */

export enum Player {
	NONE = 0,
	COMPUTER = -1,
	USER = 1,
	RIM = 2,
}

export const BOARD_SIZE = 5;

export enum OverlayType {
	IllegalMoveHover,
	LegalMoveHover,
	PossibleMove,
}
export const BOARD_INIT = [
	[Player.RIM, Player.RIM, Player.RIM, Player.RIM, Player.RIM],
	[Player.RIM, Player.USER, Player.NONE, Player.NONE, Player.RIM],
	[Player.RIM, Player.USER, Player.NONE, Player.NONE, Player.RIM],
	[Player.RIM, Player.NONE, Player.COMPUTER, Player.COMPUTER, Player.RIM],
	[Player.RIM, Player.RIM, Player.RIM, Player.RIM, Player.RIM],
];

export const White_Value = [ //maximizer // computer
	[0, 85, 90, 100, 0],
	[0, 30, 35, 40, 0],
	[0, 15, 20, 25, 0],
	[0, 0, 5, 10, 0],
	[0, 0, 0, 0, 0],
];

export const Black_Value = [ //minimizer // user
	[0, 0, 0, 0, 0],
	[0, -10, -25, -40, -60],
	[0, -5, -20, -35, -50],
	[0, 0, -15, -30, -45],
	[0, 0, 0, 0, 0],
];
