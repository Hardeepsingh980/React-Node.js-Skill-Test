import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getApi } from '../../services/api';

export const fetchMeetingData = createAsyncThunk('fetchMeetingData', async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    try {
        const response = await getApi(user.role === 'superAdmin' ? 'api/meeting/' : `api/meeting/?createBy=${user._id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
});

const meetingSlice = createSlice({
    name: 'meetings',
    initialState: {
        meetings: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMeetingData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMeetingData.fulfilled, (state, action) => {
                state.loading = false;
                state.meetings = action.payload;
            })
            .addCase(fetchMeetingData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default meetingSlice.reducer;