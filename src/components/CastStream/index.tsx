import { useEffect, useContext } from "react";
import { randNumber } from "@ngneat/falso";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { nanoid } from "nanoid";

import { Cast } from "../../model";
import { CastContext } from "../../App";

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

export const CastStream = () => {
  const { localCastState, setLocalCastState } = useContext(CastContext);
  const { allCasts } = localCastState;
  const targetUserId = randNumber({ min: 200, max: 3000 });

  useEffect(() => {
    const sse = new EventSource(
      `${process.env.REACT_APP_API_URL}sse?targetUserId=${targetUserId}`
    );

    const updateStreamDataToPanel = (data: string) => {
      const parsedCast: Cast = JSON.parse(data);

      setLocalCastState((prevState) => ({
        ...prevState,
        allCasts: [...prevState.allCasts, { ...parsedCast, id: nanoid() }],
      }));
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
