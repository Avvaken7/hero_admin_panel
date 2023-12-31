import { createSlice, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit";
import { useHttp } from '../../hooks/http.hook';


const filtersAdapter = createEntityAdapter();

const initialState = filtersAdapter.getInitialState({
    filtersLoadingStatus: 'idle',
    activeFilter: 'all'
});

export const filteredHeroes = createAsyncThunk(
    'filters/filteredHeroes',
    async () => {
        const { request } = useHttp();
        return await request(process.env.VERCEL_URL + '/json/heroes.json', 'filters');
    }
)

const heroesFiltersSlice = createSlice({
    name: 'filters',
    initialState,
    reducers: {
        activeFilterChanged: (state, action) => {
            state.activeFilter = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(filteredHeroes.pending, state => { state.filtersLoadingStatus = 'loading' })
        .addCase(filteredHeroes.fulfilled, (state, action) => {
            state.filtersLoadingStatus = 'idle';
            filtersAdapter.setAll(state, action.payload);
        })
        .addCase(filteredHeroes.rejected, state => { state.filtersLoadingStatus = 'error' })
        .addDefaultCase(() => {});
    }
})

const { actions, reducer } = heroesFiltersSlice;

export default reducer;

export const { selectAll } = filtersAdapter.getSelectors(state => state.filters);

export const {
    filtersFetching,
    filtersFetched,
    filtersFetchingError,
    activeFilterChanged
} = actions;