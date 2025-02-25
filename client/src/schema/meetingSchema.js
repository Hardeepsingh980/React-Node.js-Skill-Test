import * as yup from 'yup'

export const meetingSchema = yup.object({
    title: yup.string().required('Title is required'),
    description: yup.string(),
    startDate: yup.date().required('Start date is required'),
    endDate: yup.date()
        .required('End date is required')
        .min(yup.ref('startDate'), 'End date must be after start date'),
    location: yup.string(),
    meetingLink: yup.string().url('Must be a valid URL'),
    participants: yup.array().of(yup.string()).min(1, 'At least one participant is required'),
    status: yup.string().oneOf(['scheduled', 'completed', 'cancelled'], 'Invalid status')
})