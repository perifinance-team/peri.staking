import React, { useState } from 'react';
import styled from 'styled-components';
import OutsideClickHandler from 'react-outside-click-handler';
import Calendar from 'react-calendar';
import { format } from 'date-fns';
import { H6, H5 } from 'components/Text'

import { getCurrencyFormat } from 'lib'

const DropdownSelect = ({ data = [], onSelect, selected = [] }) => {
	const handleSelect = element => {
		if (selected.includes(element)) {
			return onSelect(selected.filter(s => s !== element));
		} else {
			return onSelect([element, ...selected]);
		}
	};
	return (
		<SelectContainer autoWidth={true}>
			<List>
				{data.map(event => {
					return (
						<ListElement key={`li-${event}`} onClick={() => handleSelect(event)}>
							<ListElementInner>
								<input
									type="checkbox"
									onChange={() => null}
									checked={selected.includes(event)}
								>
								</input>
								{/* <ListElementIcon ></ListElementIcon> */}
								<H5>
									{event}
								</H5>
							</ListElementInner>
						</ListElement>
					);
				})}
			</List>
		</SelectContainer>
	);
};

const Dropdown = ({ type, data, onSelect, selected }) => {
	const props = { data, onSelect, selected };
	switch (type) {
		case 'select':
			return <DropdownSelect {...props} />;
		case 'calendar':
			return <CalendarFilter {...props} />;
		case 'range':
			return <RangeFilter {...props} />;
		default:
			return null;
	}
};


const CalendarFilter = ({ onSelect }) => {
	return (
		<SelectContainer autoWidth={true} border={'none'}>
			<Calendar
				className="cal"
				returnValue="range"
				selectRange={true}
                locale="en"
				onChange={([from, to]) => onSelect({ from, to })}
			/>
		</SelectContainer>
	);
};

const RangeFilter = ({ onSelect, selected }) => {
	const [filters, setFilters] = useState(selected);
	let updateTimeout;

	const onChange = e => {
		const { value, name } = e.target;
		setFilters({ ...filters, ...{ [name]: value } });
	};

	const handleKey = e => {
		if (e.key === 'Enter') {
			update();
		}
	};

	const update = () => {
		clearTimeout(updateTimeout);
		if (filters.from !== selected.from || filters.to !== selected.to) {
			onSelect(filters);
		}
	};

	return (
		<SelectContainer autoWidth={false}>
			<RangeContainer>
				<H6>from</H6>
				<Input
					name="from"
					type="number"
					onChange={onChange}
					onBlur={update}
					onKeyDown={handleKey}
					value={filters.from}
				/>
				<H6>to</H6>
				<Input
					name="to"
					type="number"
					onChange={onChange}
					onBlur={update}
					onKeyDown={handleKey}
					value={filters.to}
				/>
			</RangeContainer>
		</SelectContainer>
	);
};

export const Select = ({ placeholder, type = 'select', data = null, onSelect, selected }) => {
	const [dropdownVisible, setDropdownVisible] = useState(false);
	return (
		<OutsideClickHandler onOutsideClick={() => setDropdownVisible(false)}>
			<Container>
				<Button onClick={() => setDropdownVisible(!dropdownVisible)}>
					<ButtonInner>
						{selected.length || selected.from ? (
							<SelectedValue type={type} selected={selected} data={data} placeholder={placeholder}/>
						) : (
							<H6>{placeholder}</H6>
						)}
						{/* <ButtonImage src={'/images/caret-down.svg'}></ButtonImage> */}
					</ButtonInner>
				</Button>
				{dropdownVisible ? (
					<Dropdown type={type} data={data} onSelect={onSelect} selected={selected}></Dropdown>
				) : null}
			</Container>
		</OutsideClickHandler>
	);
};

const SelectedValue = ({ type, data, selected, placeholder}) => {
	let text;

	switch (type) {
		case 'select': {
			return <H6>{placeholder}</H6>
		}

		case 'calendar':
			text = `${format(new Date(selected.from), 'dd-MM-yy')} → ${format(
				new Date(selected.to),
				'dd-MM-yy'
			)}`;
			return <H6>{text}</H6>;
		case 'range':
			text = `${getCurrencyFormat(selected.from)} → ${getCurrencyFormat(selected.to)}`;
			return <H6>{text}</H6>;
		default:
			return null;
	}
};

const Container = styled.div`
	width: 100%;
	display: flex;
	position: relative;
	align-items: center;
	margin-right: 10px;
`;

const Button = styled.button`
	height: 30px;
	background: transparent;
	border-radius: 25px;
	padding: 0px 20px;
	cursor: pointer;
	color: ${props => props.theme.colors.font.secondary};
	background-color: ${props => props.theme.colors.button.primary};
    border: none;
`;

const ButtonInner = styled.div`
	display: flex;
	align-items: center;
	text-transform: uppercase;
`;

const SelectContainer = styled.div<{autoWidth: boolean, border?: string}>`
	z-index: 10;
	position: absolute;
	top: calc(100% + 10px);
	left: 0;
	width: ${props => (props.autoWidth ? 'auto' : '100%')};
	border: 2px solid ${props => props.border ? props.border : props.theme.colors.border};
	border-radius: 15px;
	background-color: ${props => props.theme.colors.background.body};
    .react-calendar{
        border-radius: 15px;
        border: 2px solid ${props => props.theme.colors.border};
        background: #1e1d4d;
        .react-calendar__month-view__days__day--weekend {
            color: ${props => props.theme.colors.font.red};
        }
        .react-calendar__tile--now {
            border: 2px solid ${props => props.theme.colors.border};
            background: ${props => props.theme.colors.hover.background};
        }
        .react-calendar__tile--hover {
            background: ${props => props.theme.colors.hover.background};
        }
        button {
            color: ${props => props.theme.colors.font.secondary};
            :hover {
                background: ${props => props.theme.colors.hover.background};
            }
        }
    }
`;

const List = styled.ul`
	list-style: none;
	margin: 0;
	padding: 10px;
`;

const ListElement = styled.li`
	padding: 5px 0px;
	margin: 5px 0px;
	cursor: pointer;
	&:hover {
		background-color: ${props => props.theme.colors.hover.background};
	}
`;

const ListElementInner = styled.div`
	display: flex;
	align-items: center;
	> input {
		display: none;
	}
	> input + h5 {
		position: relative; /* permet de positionner les pseudo-éléments */
		padding-left: 25px; /* fait un peu d'espace pour notre case à venir */
		cursor: pointer;
        
		&:before {
			content: '';
			position: absolute;
			left: 0px; top: 3px;
			width: 14px; 
			height: 14px; 
			border: 1px solid ${props => props.theme.colors.border};
			background:  ${props => props.theme.colors.background};
			border-radius: 3px; /* angles arrondis */
		}
		&:after {
			content: '';
			position: absolute;
			top: 3px; left: 0px;
			width: 17px; height: 17px;
			background: url('/images/check-fill.svg') no-repeat;
			transition: all .2s; /* on prévoit une animation */
		}
	}
	> input:not(:checked) + h5 {
		&:after {
			opacity: 0; /* coche invisible */
			transform: scale(0); /* mise à l'échelle à 0 */
		}
	}
	> input:disabled:not(:checked) + h5 {
		&:before {
			box-shadow: none;
			border-color: #bbb;
			background-color: #ddd;
		}
	}
	> input:checked + h5 {
		&:after {
		opacity: 1; /* coche opaque */
		transform: scale(1); /* mise à l'échelle 1:1 */
		}
	}
	> input:disabled:checked + h5 {
		&:after {
		color: #999;
		}
	}
	> input:disabled + h5 {
		color: #aaa;
	}
	> input:checked:focus + h5, input:not(:checked):focus + h5 {
		&:before {
		border: 1px dotted blue;
		}
	}
`;

const RangeContainer = styled.div`
	height: 178px;
	padding: 16px 24px;
`;

const Input = styled.input`
	height: 32px;
	margin: 8px 0 25px 0;
	padding: 0 10px;
	border-radius: 5px;
	border: 1px solid ${props => props.theme.colors.border};
	background-color: ${props => props.theme.colors.background.panel};
	color: ${props => props.theme.colors.font.secondary};
	width: 100%;
	appearance: textfield;
	&::-webkit-outer-spin-button,
	&::-webkit-inner-spin-button {
		appearance: none;
		margin: 0;
	}
`;
