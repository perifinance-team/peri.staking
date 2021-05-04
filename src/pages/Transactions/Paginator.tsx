import { useState } from 'react';
import styled, { css } from 'styled-components';

const RANGE_SIZE = 10;

const getRange = currentIndex => {
	return [...Array(RANGE_SIZE).keys()].map(i => i + currentIndex);
};

const Paginator = ({ currentPage, onPageChange, disabled, lastPage }) => {
	const [startIndex, setStartIndex] = useState(currentPage);
	return (
		<Wrapper disabled={disabled}>
			<Button
				onClick={() => {
					if (startIndex > 0) {
						setStartIndex(startIndex - 1);
					}
				}}
			>
				<img src={`/images/dark/arrow/arrow-left.svg`}/>
			</Button>
			{getRange(startIndex).map(index => (
				<Button
					disabled={index >= lastPage}
					key={index + 1}
					active={index === currentPage}
					onClick={() => onPageChange(index)}
				>
					{index + 1}
				</Button>
			))}
			<Button
				disabled={startIndex + RANGE_SIZE + 1 > lastPage}
				onClick={() => {
					setStartIndex(startIndex + 1);
				}}
			>
				<img src={`/images/dark/arrow/arrow-right.svg`}/>
			</Button>
		</Wrapper>
	);
};

const disabled = css`
	opacity: 0.6;
	pointer-events: 'none';
`;

const Wrapper = styled.div<{disabled: boolean}>`
	width: 100%;
	margin: 0px 0;
	display: flex;
	justify-content: center;
	& > :first-child,
	& > :last-child {
		margin: 0 20px;
	}
	transition: opacity 0.1s ease-out;
	${props => props.disabled && disabled}
`;

const Button = styled.button<{active?: boolean}>`
	border: none;
	width: 24px;
	height: 24px;
	border-radius: 5px;
	background-color: ${props =>
		props.active
			? props.theme.colors.button.primary
			: 'transparent'};
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;
	margin: 0 5px;
	font-size: 14px;
	line-height: 25px;
	font-weight: 500;
	transition: all 0.1s ease;
	color: ${props => props.theme.colors.font.secondary};
	:hover {
		color: ${props => props.theme.colors.font.secondary};
		background-color: ${props =>
			props.active
				? props.theme.colors.hover.background
				: 'transparent'};
	}
	:disabled {
		${disabled}
	}
`;

export default Paginator;
