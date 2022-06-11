import React, { useContext, useState } from "react";
import axios from "axios";
import Button from "@mui/material/Button";

import { CastContext } from "../../App";
import { Cast, Status } from "../../model";

export const CastDetails = () => {
  const { localCastState, setLocalCastState } = useContext(CastContext);

  const [castIndex, setCastIndex] = useState(0);

  const handleSendCast = async () => {
    const { allCasts } = localCastState;
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}sendCast/originatorUserId/${allCasts[castIndex].originatorUserId}/bondId/${allCasts[castIndex].bondId}/side/${allCasts[castIndex].side}`
    );

    const currentCast: Cast = response.data?.result;
    setCastIndex(prevIndex => prevIndex+1);

    setLocalCastState((prevState) => ({
      ...prevState,
      currentCast,
    }));
  };

  const { originatorUserId, bondId, side, price, quantity, status } =
    localCastState.currentCast || {
      originatorUserId: 100,
      bondId: 1,
      side: "Buy",
      price: 123,
      quantity: 45,
      status: Status.ACTIVE,
    };

  return (
    <div>
      <div style={{ padding: "20px" }}>
        Active Cast:
        <br />
        <br />
        <span>OriginatorUserId:{originatorUserId}</span>
        <br />
        <span>BondId:{bondId}</span>
        <br />
        <span>Side:{side}</span>
        <br />
        <span>Price:{price}</span>
        <br />
        <span>Quantity:{quantity}</span>
        <br />
        <span>Status:{status}</span>
      </div>
      <Button variant="text" onClick={handleSendCast}>
        Send Cast
      </Button>
      <br />
      <br />
    </div>
  );
};
