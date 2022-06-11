import React, { useEffect, useState } from "react";
import { randNumber } from "@ngneat/falso";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { nanoid } from "nanoid";
// import axios from "axios";

export enum Status {
  ACTIVE = "Active",
  CANCELLED = "Cancelled",
}

export interface Cast {
  originatorUserId: number;
  bondId: number;
  side: "Buy" | "Sell";
  price: number | undefined;
  quantity: number | undefined;
  status: Status;
  targetUserIds: number[];
  id: string;
}

const columns: GridColDef[] = [
  {
    field: "originatorUserId",
    headerName: "Originator UserId",
    width: 160,
    type: "number",
  },
  { field: "bondId", headerName: "BondId", width: 160, type: "number" },
  { field: "side", headerName: "Side", width: 160 },
  {
    field: "price",
    headerName: "Price",
    type: "number",
    width: 100,
  },
  {
    field: "quantity",
    headerName: "Quantity",
    type: "number",
    width: 160,
  },
  {
    field: "status",
    headerName: "Status",
    width: 160,
  },
];

export const Events = () => {
  const [allCasts, setAllCasts] = useState<Cast[]>([]);
  const targetUserId = randNumber({ min: 200, max: 3000 });

  useEffect(() => {
    const sse = new EventSource(
      `http://localhost:4000/sse?targetUserId=${targetUserId}`
    );

    const updateStreamDataToPanel = (data: string) => {
      const parsedCast: Cast = JSON.parse(data);
      setAllCasts((prevState) => [
        ...prevState,
        { ...parsedCast, id: nanoid() },
      ]);
    };

    sse.addEventListener("streamCasts", ({ data }) => {
      updateStreamDataToPanel(data);
    });

    sse.onerror = () => {
      sse.close();
    };

    // ComponentWillUnmount
    return () => {
      sse.close();
    };
  }, []);

  return (
    <div style={{ padding: "0 20px", height: "100vh" }}>
      <DataGrid rows={allCasts} columns={columns} />
    </div>
  );
};
