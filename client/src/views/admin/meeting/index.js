import { useEffect, useState } from 'react';
import { DeleteIcon, ViewIcon } from '@chakra-ui/icons';
import { Button, Menu, MenuButton, MenuItem, MenuList, Text, useDisclosure } from '@chakra-ui/react';
import { getApi } from 'services/api';
import { HasAccess } from '../../../redux/accessUtils';
import CommonCheckTable from '../../../components/reactTable/checktable';
import { SearchIcon } from "@chakra-ui/icons";
import { CiMenuKebab } from 'react-icons/ci';
import { Link, useNavigate } from 'react-router-dom';
import MeetingAdvanceSearch from './components/MeetingAdvanceSearch';
import AddMeeting from './components/Addmeeting';
import CommonDeleteModel from 'components/commonDeleteModel';
import { deleteManyApi } from 'services/api';
import { toast } from 'react-toastify';
import { fetchMeetingData } from '../../../redux/slices/meetingSlice';
import { useDispatch, useSelector } from 'react-redux';

const Index = () => {
    const title = "Meetings";
    const navigate = useNavigate();
    const [action, setAction] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedValues, setSelectedValues] = useState([]);
    const [advanceSearch, setAdvanceSearch] = useState(false);
    const [getTagValuesOutSide, setGetTagValuesOutside] = useState([]);
    const [searchboxOutside, setSearchboxOutside] = useState('');
    const user = JSON.parse(localStorage.getItem("user"));
    const [deleteMany, setDeleteMany] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [displaySearchData, setDisplaySearchData] = useState(false);
    const [searchedData, setSearchedData] = useState([]);
    const [permission] = HasAccess(['Meetings']);

    const dispatch = useDispatch();
    const { meetings, loading: meetingsLoading } = useSelector((state) => state.meetingData);

    const actionHeader = {
        Header: "Action",
        isSortable: false,
        center: true,
        cell: ({ row }) => (
            <Text fontSize="md" fontWeight="900" textAlign={"center"}>
                <Menu isLazy>
                    <MenuButton><CiMenuKebab /></MenuButton>
                    <MenuList minW={'fit-content'}>
                        {permission?.view && (
                            <MenuItem
                                py={2.5}
                                color={'green'}
                                onClick={() => navigate(`/meeting/${row?.values._id}`)}
                                icon={<ViewIcon fontSize={15} />}
                            >
                                View
                            </MenuItem>
                        )}
                        {permission?.delete && (
                            <MenuItem
                                py={2.5}
                                color={'red'}
                                onClick={() => {
                                    setDeleteMany(true);
                                    setSelectedValues([row?.values?._id]);
                                }}
                                icon={<DeleteIcon fontSize={15} />}
                            >
                                Delete
                            </MenuItem>
                        )}
                    </MenuList>
                </Menu>
            </Text>
        )
    };

    const tableColumns = [
        {
            Header: "#",
            accessor: "_id",
            isSortable: false,
            width: 10
        },
        {
            Header: 'Title',
            accessor: 'title',
            cell: (cell) => (
                <Link to={`/meeting/${cell?.row?.values._id}`}>
                    <Text
                        me="10px"
                        sx={{ '&:hover': { color: 'blue.500', textDecoration: 'underline' } }}
                        color='brand.600'
                        fontSize="sm"
                        fontWeight="700"
                    >
                        {cell?.value || ' - '}
                    </Text>
                </Link>
            )
        },
        {
            Header: "Start Date",
            accessor: "startDate",
            cell: (cell) => (
                <Text>
                    {cell?.value ? new Date(cell?.value).toLocaleString() : '-'}
                </Text>
            )
        },
        {
            Header: "End Date",
            accessor: "endDate",
            cell: (cell) => (
                <Text>
                    {cell?.value ? new Date(cell?.value).toLocaleString() : '-'}
                </Text>
            )
        },
        {
            Header: "Status",
            accessor: "status",
            cell: (cell) => (
                <Text textTransform="capitalize">
                    {cell?.value || '-'}
                </Text>
            )
        },
        {
            Header: "Created By",
            accessor: "createBy",
            cell: (cell) => (
                <Text>
                    {cell?.value ? `${cell?.value?.firstName || ''} ${cell?.value?.lastName || ''}` : '-'}
                </Text>
            )
        },
        ...(permission?.update || permission?.view || permission?.delete ? [actionHeader] : [])
    ];

    const handleDeleteMeeting = async (ids) => {
        try {
            setIsLoading(true);
            let response = await deleteManyApi('api/meeting/deleteMany', { ids });
            if (response.status === 200) {
                setSelectedValues([]);
                setDeleteMany(false);
                setAction((pre) => !pre);
                toast.success('Meeting(s) deleted successfully');
            }
        } catch (error) {
            console.log(error);
            toast.error('Failed to delete meeting(s)');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        dispatch(fetchMeetingData());
    }, [dispatch, action]);

    return (
        <div>
            <CommonCheckTable
                title={title}
                isLoading={isLoading || meetingsLoading}
                columnData={tableColumns}
                tableData={meetings || []}
                searchDisplay={displaySearchData}
                setSearchDisplay={setDisplaySearchData}
                searchedDataOut={searchedData}
                setSearchedDataOut={setSearchedData}
                access={permission}
                onOpen={onOpen}
                selectedValues={selectedValues}
                setSelectedValues={setSelectedValues}
                setDelete={setDeleteMany}
                AdvanceSearch={
                    <Button
                        variant="outline"
                        colorScheme='brand'
                        leftIcon={<SearchIcon />}
                        mt={{ sm: "5px", md: "0" }}
                        size="sm"
                        onClick={() => setAdvanceSearch(true)}
                    >
                        Advanced Search
                    </Button>
                }
                getTagValuesOutSide={getTagValuesOutSide}
                searchboxOutside={searchboxOutside}
                setGetTagValuesOutside={setGetTagValuesOutside}
                setSearchboxOutside={setSearchboxOutside}
                handleSearchType="MeetingSearch"
            />

            <MeetingAdvanceSearch
                advanceSearch={advanceSearch}
                setAdvanceSearch={setAdvanceSearch}
                setSearchedData={setSearchedData}
                setDisplaySearchData={setDisplaySearchData}
                allData={meetings}
                setAction={setAction}
                setGetTagValues={setGetTagValuesOutside}
                setSearchbox={setSearchboxOutside}
            />

            <AddMeeting
                setAction={setAction}
                isOpen={isOpen}
                onClose={onClose}
            />

            <CommonDeleteModel
                isOpen={deleteMany}
                onClose={() => setDeleteMany(false)}
                type='Meeting'
                handleDeleteData={handleDeleteMeeting}
                ids={selectedValues}
            />
        </div>
    );
};

export default Index;