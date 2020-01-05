import React, { useEffect, useContext, useState } from "react";
import RequestContext from "../../contexts/RequestContext";
import { useRequestFiltering, Filters } from "../filters/Filters";
import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { PersonDirectorates as directorates } from "../../constants/PersonDirectorates";
import { Request } from "../../services/models/Request";

export const DirectorateTable = () => {
  const context = useContext(RequestContext);
  const { applyFilters } = useRequestFiltering();
  const [model, setModel] = useState<any>({});

  //when there's data, create the view model
  useEffect(() => {
    const model = createDirectorateViewModel(context.requests);
    setModel(model);
  }, [context.requests]);

  const createDirectorateViewModel = (requests: Request[]) => {
    directorates.map(directorate => {
      const open = applyFilters(
        { ...new Filters(), directorate: directorate, status: "All Open" },
        requests
      );

      const closed = applyFilters(
        { ...new Filters(), directorate: directorate, status: "Closed" },
        requests
      );

      const counts = {
        open: open.length,
        closed: closed.length
      };
      model[directorate] = counts;
    });
    return model;
  };

  return (
    <Table>
      <thead>
        <tr>
          <th>Directorate</th>
          <th>Open</th>
          <th>Closed</th>
        </tr>
      </thead>
      <tbody>
        {directorates.map(directorate => {
          return (
            model[directorate] && (
              <tr key={`dir-row-${directorate}`}>
                <td>
                  <Link to={`/requests/by-directorate/${directorate}`}>
                    {directorate}
                  </Link>
                </td>
                <td>{model[directorate].open}</td>
                <td>{model[directorate].closed}</td>
              </tr>
            )
          );
        })}
        <tr>
          <td>
            <b>All Directorates</b>
          </td>
          <td>
            <b>
              {
                applyFilters(
                  { ...new Filters(), status: "All Open" },
                  context.requests
                ).length
              }
            </b>
          </td>
          <td>
            <b>
              {
                applyFilters(
                  { ...new Filters(), status: "Closed" },
                  context.requests
                ).length
              }
            </b>
          </td>
        </tr>
      </tbody>
    </Table>
  );
};
