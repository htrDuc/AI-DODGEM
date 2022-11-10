/** @format */

import { OverlayType } from "./const";

interface OverlayProps {
	type: OverlayType;
}

export const Overlay = ({ type }: OverlayProps) => {
	const color = getOverlayColor(type);
	return (
		<div
			className='overlay'
			// role={type}
			style={{
				height: "100%",
				width: "100%",
				zIndex: 1,
				opacity: 0.5,
				backgroundColor: color,
			}}
		/>
	);
};
function getOverlayColor(type: OverlayType) {
	switch (type) {
		case OverlayType.IllegalMoveHover: // bất hợp pháp
			return "red";
		case OverlayType.LegalMoveHover: // hợp pháp
			return "green";
		case OverlayType.PossibleMove: // ko được
			return "yellow";
	}
}
