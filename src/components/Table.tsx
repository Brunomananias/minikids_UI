import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const StyledTableCell = withStyles((theme: { palette: { common: { black: any; white: any; }; }; }) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme: { palette: { action: { hover: any; }; }; }) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
});

// Define the type for each column
interface Column {
  id: string;
  label: string;
  format?: (value: any) => string;
  align?: 'right' | 'left';
}

// Define the type for the data rows
interface DataRow {
  [key: string]: any;
}

// Define the props type for the CustomizedTables component
interface CustomizedTablesProps {
  data: DataRow[];
  columns: Column[];
}

export default function CustomizedTables({ data, columns }: CustomizedTablesProps) {
  const classes = useStyles();

  return (
    <TableContainer component={Paper} style={{ marginTop: '20px' }}>
      <Table className={classes.table} aria-label="customized table">
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <StyledTableCell key={column.id}>{column.label}</StyledTableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length > 0 ? (
            data.map((row, index) => (
              <StyledTableRow key={index}>
                {columns.map((column) => (
                  <StyledTableCell key={column.id} align={column.align || 'left'}>
                    {column.format ? column.format(row[column.id]) : row[column.id]}
                  </StyledTableCell>
                ))}
              </StyledTableRow>
            ))
          ) : (
            <StyledTableRow>
              <StyledTableCell colSpan={columns.length} style={{ textAlign: 'center' }}>
                Nenhum evento cadastrado
              </StyledTableCell>
            </StyledTableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
