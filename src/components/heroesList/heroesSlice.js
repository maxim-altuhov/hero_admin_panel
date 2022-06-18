import { useHttp } from '../../hooks/http.hook';
import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
} from '@reduxjs/toolkit';

const heroesAdapter = createEntityAdapter();
const initialState = heroesAdapter.getInitialState({
  heroesLoadingStatus: 'idle',
});

export const fetchHeroes = createAsyncThunk('heroes/fetchHeroes', async () => {
  const { request } = useHttp();

  return await request(process.env.PUBLIC_URL + '/json/data.json', 'heroes');
});

const heroesSlice = createSlice({
  name: 'heroes',
  initialState,
  reducers: {
    addHero: (state, action) => {
      heroesAdapter.addOne(state, action.payload);
    },
    deleteHero: (state, action) => {
      heroesAdapter.removeOne(state, action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHeroes.pending, (state) => {
        state.heroesLoadingStatus = 'loading';
      })
      .addCase(fetchHeroes.fulfilled, (state, action) => {
        state.heroesLoadingStatus = 'idle';
        heroesAdapter.setAll(state, action.payload);
      })
      .addCase(fetchHeroes.rejected, (state) => {
        state.heroesLoadingStatus = 'error';
      })
      .addDefaultCase(() => {});
  },
});

const { actions, reducer } = heroesSlice;
const { selectAll: allHeroes } = heroesAdapter.getSelectors((state) => state.heroes);

export default reducer;
export const { heroesFetching, heroesFetched, heroesFetchingError, addHero, deleteHero } = actions;
export const filteredHeroesSelector = createSelector(
  (state) => state.filters.activeFilter,
  allHeroes,
  (activeFilter, heroes) => {
    if (activeFilter === 'all') {
      return heroes;
    } else {
      return heroes.filter((hero) => hero.element === activeFilter);
    }
  },
);
