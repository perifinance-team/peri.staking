import React from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "config/reducers";
import { toggleNoti } from "config/reducers/liquidation";

const LiquidNotification = () => {
  const dispatch = useDispatch();
  const { notification } = useSelector((state: RootState) => state.liquidation);

  const liquidAlert = [
    { title: "Success", desc: "Liquidation escape complete" },
    {
      title: "Warning",
      desc: "If C-ratio is not recovered to over 150% in 24 hours,\nyour collateral can be liquidated. You must press 'Escape' button\nafter you raise your C-ratio above 150% in order to avoid liquidation.",
    },
  ];

  const onToggleHandler = () => {
    dispatch(toggleNoti({ toggle: false, title: 0 }));
  };

  return (
    <LiquidationNoti $toggle={notification.toggle} $title={notification.title}>
      <div className="icon">!</div>
      <div className="notiContainer">
        <h4>{liquidAlert[notification.title].title}</h4>
        <span>{liquidAlert[notification.title].desc}</span>
      </div>
      <div className="closeBtn" onClick={() => onToggleHandler()}>
        <div className="sect01">
          <div className="line-box">
            <span className="line-01" />
            <span className="line-02" />
          </div>
        </div>
      </div>
    </LiquidationNoti>
  );
};

interface ILiquidationNoti {
  $toggle: boolean;
  $title: any;
}

const LiquidationNoti = styled.div<ILiquidationNoti>`
  display: ${(props) => (props.$toggle ? "flex" : "none")};
  align-items: center;
  position: absolute;
  background: ${(props) => (props.$title === 0 ? "#5cb85c" : "#fc3b3b")};
  color: white;
  bottom: 30px;
  right: 0;
  width: 55rem;
  height: 10rem;

  .icon {
    display: flex;
    justify-content: center;
    align-items: center;
    background: white;
    color: ${(props) => (props.$title === 0 ? "#5cb85c" : "#fc3b3b")};
    font-weight: bold;
    font-size: 1rem;
    width: 20px;
    height: 20px;
    min-width: 20px;
    min-height: 20px;
    border-radius: 50%;
    margin: 2rem;
  }

  .notiContainer {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    height: 100%;
    padding-bottom: 1rem;

    h4 {
      font-size: 0.875rem;
      margin: 2rem 0 1rem 0;
    }

    span {
      white-space: pre-wrap;
      font-size: 0.75rem;
    }
  }

  .closeBtn {
    position: absolute;
    right: 0;
    top: 0;
    width: 1.6rem;
    height: 1.6rem;
    margin: 1rem;
    cursor: pointer;

    .line-box {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 100%;
      height: 100%;
    }

    .line-box > span {
      position: absolute;
      top: 50%;
      width: 100%;
      height: 2px;
      background-color: white;
    }

    .line-01 {
      transform: rotate(135deg) translateX(0%);
    }

    .line-02 {
      transform: rotate(45deg) translateX(0%);
    }
  }
`;

export default LiquidNotification;
