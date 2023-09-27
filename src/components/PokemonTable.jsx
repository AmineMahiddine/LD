import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";

import {
  Box,
  TextField,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Paper,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import SearchIcon from '@mui/icons-material/Search';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';


function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleBackButtonClick = () => onPageChange(null, page - 1);
  const handleNextButtonClick = () => onPageChange(null, page + 1);

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

function PokemonTable() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [pokemonData, setPokemonData] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [minPower, setMinPower] = useState(0);

  useEffect(() => {
    fetch("/pokemon.json")
      .then((response) => response.json())
      .then((data) => setPokemonData(data));
  }, []);

  const calculatePower = (pokemon) => {
    return (
      pokemon.hp +
      pokemon.attack +
      pokemon.defense +
      pokemon.special_attack +
      pokemon.special_defense +
      pokemon.speed
    );
  };

  const filteredPokemon = pokemonData
    .filter((pokemon) =>
      pokemon.name.toLowerCase().includes(searchName.toLowerCase())
    )
    .filter((pokemon) => calculatePower(pokemon) >= minPower);

  const currentMinPower = Math.min(
    ...filteredPokemon
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      .map((pokemon) => calculatePower(pokemon))
  );

  const currentMaxPower = Math.max(
    ...filteredPokemon
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      .map((pokemon) => calculatePower(pokemon))
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - filteredPokemon.length)
      : 0;

  return (
    <Stack spacing={3} margin={6} >
      <Paper
        sx={{
          padding: 2,
          boxShadow: 3,
        }}
      >
        <Stack spacing={1} direction="row" marginBottom={2}>
          <TextField
            id="outlined-basic"
            // label="Search..."
            placeholder="Search..."
            variant="outlined"
            size="small"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            sx={{
              flexGrow: 1,
            }}
            InputProps={{
              startAdornment: (
                  <SearchIcon sx={{ marginRight: '8px'}}/>
              ),
            }}
          />

          <TextField
            type="number"
            id="outlined-basic"
            label="Power threshold"
            placeholder="Power threshold"
            variant="outlined"
            size="small"
            value={minPower}
            onChange={(e) => setMinPower(parseInt(e.target.value))}
            sx={{
              flexGrow: 1,
            }}
            InputProps={{
              startAdornment: (
                  <FavoriteBorderIcon sx={{ marginRight: '8px'}}/>
              ),
            }}
          />
        </Stack>

        <Box>
          <Typography>Min Power: {currentMinPower}</Typography>
          <Typography>Max Power: {currentMaxPower}</Typography>
        </Box>
      </Paper>

      <Stack alignItems="end">
        <TableContainer component={Paper} sx={{ boxShadow: 3 , marginTop: 3 }}>
          <Table>
            <TableHead style={{ backgroundColor: "#F9F9F9" }}>
              <TableRow style={{color: "red "}}>
                <TableCell align="center">ID</TableCell>
                <TableCell align="center">Name</TableCell>
                <TableCell align="center">Type</TableCell>
                <TableCell align="center">Health</TableCell>
                <TableCell align="center">Attack</TableCell>
                <TableCell align="center">Defense</TableCell>
                <TableCell align="center">Special Attack</TableCell>
                <TableCell align="center">Special Defense</TableCell>
                <TableCell align="center">Speed</TableCell>
              </TableRow>
            </TableHead>
            <TableBody align="center">
              {(rowsPerPage > 0
                ? filteredPokemon.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : filteredPokemon
              ).map((pokemon) => (
                <TableRow key={pokemon.id}>
                  <TableCell align="center" scope="row">{pokemon.id}</TableCell>
                  <TableCell align="center" scope="row">{pokemon.name}</TableCell>
                  <TableCell align="center" scope="row">{pokemon.type.join(", ")}</TableCell>
                  <TableCell align="center">{pokemon.hp}</TableCell>
                  <TableCell align="center">{pokemon.attack}</TableCell>
                  <TableCell align="center">{pokemon.defense}</TableCell>
                  <TableCell align="center">{pokemon.special_attack}</TableCell>
                  <TableCell align="center">{pokemon.special_defense}</TableCell>
                  <TableCell align="center">{pokemon.speed}</TableCell>
                </TableRow>
              ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={9} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
          colSpan={9}
          count={filteredPokemon.length}
          rowsPerPage={rowsPerPage}
          page={page}
          SelectProps={{
            inputProps: {
              "aria-label": "rows per page",
            },
            native: true,
          }}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          ActionsComponent={TablePaginationActions}
          sx={{
            border: "none",
          }}
        />
      </Stack>
    </Stack>
  );
}

export default PokemonTable;
