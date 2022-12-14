/** @format */

import clsx from "clsx";
import React, { useCallback, useEffect, useState } from "react";
import Board from "./Board";
import { Player, BOARD_INIT } from "./const";
import { game } from "./Helper/Game";
import "./scss/App.scss";
import "antd/dist/antd.css";

export type CurrentUserPlay = Player.COMPUTER | Player.USER; //maximizer || minimizer

interface AppContextType {
	currentUserPlay: Player;
	currentSelectPosition: number[];
	boardState: any;
	setCurrentUserPlay: () => void;
	userMove: (toX: number, toY: number) => void;
	changeCurrentSelectPosition: (x: number, y: number) => void;
	canLegalMove: (toX: number, toY: number, player: Player) => boolean;
	isStart: boolean,
}

export const AppContext = React.createContext<AppContextType>({
	currentUserPlay: Player.USER,
	currentSelectPosition: [] as number[],
	boardState: [],
	setCurrentUserPlay: () => {},
	userMove: (toX: number, toY: number) => {},
	changeCurrentSelectPosition: (x: number, y: number) => {},
	canLegalMove: (toX: number, toY: number, player: Player) => true,
	isStart: false,
});

function App() {
	const [currentUserPlay, setCurrentUserPlay] = useState<CurrentUserPlay>(
		Player.COMPUTER
	);
	const [currentSelectPosition, setCurrentSelectPosition] = useState<number[]>(
		[]
	);
	const [boardState, setBoardState] = useState(BOARD_INIT);
	const [level, setLevel] = useState<number>(3);
	const [isStart, setStart] = useState(false);
	const [winner, setWinner] = useState<Player | null>(null);

	const changeUserPlay = useCallback(() => {
		setCurrentUserPlay(
			currentUserPlay === Player.COMPUTER ? Player.USER : Player.COMPUTER
		);
	}, [currentUserPlay]);

	//move point
	const userMove = useCallback(
		(toX, toY) => {
			//Check if place dont have point to set new position of point select
			if (
				(boardState[toX][toY] === Player.NONE ||
					boardState[toX][toY] === Player.RIM) &&
				currentSelectPosition.length > 0
			) {
				const currentBoardValue = [...boardState];
				// move set old position = 0
				currentBoardValue[currentSelectPosition[0]][
					currentSelectPosition[1]
				] = 0;
				// assign new position to current user value
				currentBoardValue[toX][toY] = currentUserPlay;
				setBoardState(currentBoardValue);

				if (game.isWinning(Player.USER)) {
					userWinning(Player.USER);
					return;
				}
				setCurrentSelectPosition([]);
				changeUserPlay();
			}
		},
		[boardState, changeUserPlay, currentSelectPosition, currentUserPlay]
	);

	//check can move point
	const canMovePoint = useCallback(
		(toX, toY, player) => {
			const [cX, cY] = currentSelectPosition;
			const dx = toX - cX;
			const dy = toY - cY;
			// Check user can move point
			if (currentUserPlay === Player.USER) {
				return (
					(Math.abs(dx) === 1 && Math.abs(dy) === 0) ||
					(Math.abs(dx) === 0 && dy === 1)
				);
			} else {
			// Check computer can move point
				return (
					(dx === -1 && Math.abs(dy) === 0) ||
					(Math.abs(dx) === 0 && Math.abs(dy) === 1)
				);
			}
		},
		[currentSelectPosition, currentUserPlay]
	);

	const changeCurrentSelectPosition = useCallback((x, y) => {
		setCurrentSelectPosition([x, y]);
	}, []);


	const setLevelGame = useCallback((value: number) => {
		setLevel(value);
	}, []);

	const userWinning = (player: Player | null) => {
		if (player) {
			setWinner(player);
		}
	};

	useEffect(() => {
		// computer auto play
		if (currentUserPlay === Player.COMPUTER && isStart) {
			setBoardState(
				game.getBestMovePoint(
					boardState,
					Player.COMPUTER,
					(player: Player | null) => userWinning(player)
				)
			);
			changeUserPlay();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [boardState, changeUserPlay, currentUserPlay, isStart]);

	useEffect(() => {
		setStart(false);
		setBoardState(BOARD_INIT);
		setCurrentUserPlay(Player.COMPUTER);
		game.setLevel(level);
		setWinner(null);
	}, [level, setLevelGame])

	useEffect(() => {
		if(!isStart) {
			setBoardState(BOARD_INIT);
			setCurrentUserPlay(Player.COMPUTER);
			setWinner(null);
		}
	}, [isStart])
	return (
		<>
			<AppContext.Provider
				value={{
					currentUserPlay,
					currentSelectPosition,
					boardState: boardState,
					setCurrentUserPlay: changeUserPlay,
					userMove: userMove,
					changeCurrentSelectPosition: changeCurrentSelectPosition,
					canLegalMove: canMovePoint,
					isStart: isStart
				}}>
				<div className='app__container'>
					<Board
						boardState={boardState}
						setStart={setStart}
						setLevel={setLevelGame}
						isStart={isStart}
						level={level}
					/>

					<div>
						{winner && (
							<pre className='app__winner'>
								{`Qu??n   `}
								<div
									className={`${clsx(
										"square__wrapper",
										winner === Player.COMPUTER && "square__computer",
										winner === Player.USER && "square__user"
									)}`}></div>
								{`   th???ng`}
							</pre>
						)}
					</div>
				</div>
			</AppContext.Provider>
		</>
	);
}

export default App;
