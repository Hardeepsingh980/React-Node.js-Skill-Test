import {
    Button,
    Flex,
    FormLabel,
    Grid,
    GridItem,
    IconButton,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Select,
    Text,
    Textarea
} from '@chakra-ui/react';
import { CUIAutoComplete } from 'chakra-ui-autocomplete';
import Spinner from 'components/spinner/Spinner';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { LiaMousePointerSolid } from 'react-icons/lia';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { meetingSchema } from 'schema';
import { getApi, postApi } from 'services/api';

const AddMeeting = (props) => {
    const { onClose, isOpen, setAction } = props;
    const [isLoading, setIsLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const user = JSON.parse(localStorage.getItem('user'));

    const initialValues = {
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        location: '',
        meetingLink: '',
        participants: [],
        status: 'scheduled',
        createBy: user?._id
    };

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: meetingSchema,
        onSubmit: (values) => {
            AddData(values);
        },
    });

    const { errors, touched, values, handleBlur, handleChange, handleSubmit, setFieldValue } = formik;

    const AddData = async (values) => {
        try {
            setIsLoading(true);
            const response = await postApi('api/meeting/add', values);
            if (response.status === 201) {
                toast.success('Meeting created successfully');
                formik.resetForm();
                setAction((prev) => !prev);
                onClose();
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await getApi('api/user');
            if (response.status === 200) {
                // Ensure response.data is an array before setting it
                if (Array.isArray(response.data)) {
                    setUsers(response.data);
                } else {
                    setUsers([]);
                    console.error('Expected array of users but got:', response.data);
                }
            }
        } catch (error) {
            console.log(error);
            setUsers([]);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const extractLabels = (selectedItems) => {
        return selectedItems.map((item) => item._id);
    };

    const usersForAutoComplete = Array.isArray(users) ? users.map((user) => ({
        ...user,
        value: user._id,
        label: `${user.firstName} ${user.lastName}`,
    })) : [];

    return (
        <Modal onClose={onClose} isOpen={isOpen} isCentered size="xl">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Add Meeting</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Grid templateColumns="repeat(12, 1fr)" gap={3}>
                        <GridItem colSpan={{ base: 12 }}>
                            <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                Title<Text color={"red"}>*</Text>
                            </FormLabel>
                            <Input
                                fontSize='sm'
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.title}
                                name="title"
                                placeholder='Meeting Title'
                                fontWeight='500'
                                borderColor={errors.title && touched.title ? "red.300" : null}
                            />
                            <Text fontSize='sm' color={'red'}>{errors.title && touched.title && errors.title}</Text>
                        </GridItem>

                        <GridItem colSpan={{ base: 12 }}>
                            <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                Description
                            </FormLabel>
                            <Textarea
                                resize={'none'}
                                fontSize='sm'
                                placeholder='Meeting Description'
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.description}
                                name="description"
                                fontWeight='500'
                                borderColor={errors.description && touched.description ? "red.300" : null}
                            />
                            <Text fontSize='sm' color={'red'}>{errors.description && touched.description && errors.description}</Text>
                        </GridItem>

                        <GridItem colSpan={{ base: 12, md: 6 }}>
                            <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                Start Date & Time<Text color={"red"}>*</Text>
                            </FormLabel>
                            <Input
                                fontSize='sm'
                                type='datetime-local'
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.startDate}
                                name="startDate"
                                fontWeight='500'
                                borderColor={errors.startDate && touched.startDate ? "red.300" : null}
                            />
                            <Text fontSize='sm' color={'red'}>{errors.startDate && touched.startDate && errors.startDate}</Text>
                        </GridItem>

                        <GridItem colSpan={{ base: 12, md: 6 }}>
                            <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                End Date & Time<Text color={"red"}>*</Text>
                            </FormLabel>
                            <Input
                                fontSize='sm'
                                type='datetime-local'
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.endDate}
                                name="endDate"
                                fontWeight='500'
                                borderColor={errors.endDate && touched.endDate ? "red.300" : null}
                            />
                            <Text fontSize='sm' color={'red'}>{errors.endDate && touched.endDate && errors.endDate}</Text>
                        </GridItem>

                        <GridItem colSpan={{ base: 12, md: 6 }}>
                            <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                Location
                            </FormLabel>
                            <Input
                                fontSize='sm'
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.location}
                                name="location"
                                placeholder='Meeting Location'
                                fontWeight='500'
                                borderColor={errors.location && touched.location ? "red.300" : null}
                            />
                            <Text fontSize='sm' color={'red'}>{errors.location && touched.location && errors.location}</Text>
                        </GridItem>

                        <GridItem colSpan={{ base: 12, md: 6 }}>
                            <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                Meeting Link
                            </FormLabel>
                            <Input
                                fontSize='sm'
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.meetingLink}
                                name="meetingLink"
                                placeholder='https://meeting-link.com'
                                fontWeight='500'
                                borderColor={errors.meetingLink && touched.meetingLink ? "red.300" : null}
                            />
                            <Text fontSize='sm' color={'red'}>{errors.meetingLink && touched.meetingLink && errors.meetingLink}</Text>
                        </GridItem>

                        <GridItem colSpan={{ base: 12 }}>
                            <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                Status
                            </FormLabel>
                            <Select
                                fontSize='sm'
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.status}
                                name="status"
                                fontWeight='500'
                                borderColor={errors.status && touched.status ? "red.300" : null}
                            >
                                <option value="scheduled">Scheduled</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </Select>
                            <Text fontSize='sm' color={'red'}>{errors.status && touched.status && errors.status}</Text>
                        </GridItem>

                        <GridItem colSpan={{ base: 12 }}>
                            <Flex alignItems={'end'} justifyContent={'space-between'}>
                                <Text w={'100%'}>
                                    <CUIAutoComplete
                                        label="Select Participants"
                                        placeholder="Type a name"
                                        name="participants"
                                        items={usersForAutoComplete}
                                        selectedItems={usersForAutoComplete.filter((item) => values.participants.includes(item._id))}
                                        onSelectedItemsChange={(changes) => {
                                            const selectedIds = extractLabels(changes.selectedItems);
                                            setFieldValue('participants', selectedIds);
                                        }}
                                    />
                                </Text>
                            </Flex>
                            <Text fontSize='sm' color={'red'}>{errors.participants && touched.participants && errors.participants}</Text>
                        </GridItem>
                    </Grid>
                </ModalBody>
                <ModalFooter>
                    <Button variant='brand' me={2} disabled={isLoading} onClick={handleSubmit}>
                        {isLoading ? <Spinner /> : 'Save'}
                    </Button>
                    <Button
                        variant="outline"
                        colorScheme="red"
                        onClick={() => {
                            formik.resetForm();
                            onClose();
                        }}
                    >
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default AddMeeting;

