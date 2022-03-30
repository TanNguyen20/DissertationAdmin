import { filter } from 'lodash';
import { useState, useEffect } from 'react';
import FormDialog from '../components/FormCreateDiscount.js';
// material
import {
  Card,
  Table,
  Stack,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  CircularProgress
} from '@mui/material';
// components
import Dialog from '../components/Dialog.js';
import Page from '../components/Page';
import Scrollbar from '../components/Scrollbar';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../components/_dashboard/discount';
//
import useGetAllDiscount from '../hooks/useGetAllDiscount';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Tên mã giảm giá', alignRight: false },
  { id: 'code', label: 'Mã code', alignRight: false },
  { id: 'percentSale', label: '% giảm', alignRight: false },
  { id: 'endDate', label: 'Hạn dùng', alignRight: false },
  { id: 'description', label: 'Mô tả', alignRight: false },
  { id: '' }
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_store) => _store.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function Discount() {
  let [loading, discount] = useGetAllDiscount();
  const [dialog, setDialog] = useState(false);
  const [page, setPage] = useState(0);
  const [titleDialog, setTitleDialog] = useState('');
  const [contentDialog, setContentDialog] = useState('');
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [discountList, setDiscountList] = useState(null);
  const [emptyRows, setEmptyRows] = useState(page > 0 ? Math.max(0, (1 + page) * rowsPerPage - discount.length) : 0);
  const [filteredUsers, setFilteredStore] = useState(applySortFilter(discount, getComparator(order, orderBy), filterName));
  useEffect(() => {
    setFilteredStore(applySortFilter(discount, getComparator(order, orderBy), filterName));
    setEmptyRows(page > 0 ? Math.max(0, (1 + page) * rowsPerPage - discount.length) : 0);
    return setDiscountList(discount);
  }, [discount]);
  const getStoreFromChild = (storeChild) => {
    discount.push(storeChild);
    setFilteredStore(applySortFilter(discount, getComparator(order, orderBy), filterName))
    setEmptyRows(page > 0 ? Math.max(0, (1 + page) * rowsPerPage - discount.length) : 0);
    setDiscountList(applySortFilter(discount, getComparator(order, orderBy), filterName));
  };
  const getStoreFromChildDelete = (storeChild) => {
    discount = discount.filter(item => item._id !== storeChild._id);
    setFilteredStore(applySortFilter(discount, getComparator(order, orderBy), filterName));
    setEmptyRows(page > 0 ? Math.max(0, (1 + page) * rowsPerPage - discount.length) : 0);
    setDiscountList(applySortFilter(discount, getComparator(order, orderBy), filterName));
  };
  const getStoreFromChildUpdate = async (storeChild) => {
    let newDiscountList = await discount.map(item => {
      if (item._id === storeChild._id) {
        return storeChild;
      }
      return item;
    });
    setFilteredStore(applySortFilter(newDiscountList, getComparator(order, orderBy), filterName));
    setEmptyRows(page > 0 ? Math.max(0, (1 + page) * rowsPerPage - discount.length) : 0);
    setDiscountList(applySortFilter(newDiscountList, getComparator(order, orderBy), filterName));
  };
  ////
  const statusDialogDelete = (status) => {
    setDialog(status);
    setTitleDialog('Thông báo');
    setContentDialog('Xóa mã giảm giá thành công !');
  };
  const dialogUpdateDiscount = (status) => {
    setDialog(status);
    setTitleDialog('Thông báo');
    setContentDialog('Cập nhật thông tin mã giảm giá thành công !');
  };
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    console.log('handle sort',isAsc);
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = discountList.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };
  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };
  if (loading) return <>
    <h2 style={{ textAlign: "center" }}>Đang tải danh sách cửa hàng</h2>
    <Stack alignItems="center" mt={10}>
      <CircularProgress size={80} />
    </Stack>
  </>;
  const filteredUsers1 = applySortFilter(discountList, getComparator(order, orderBy), filterName);
  const isUserNotFound = filteredUsers1.length === 0;
  return (
    <Page title="Mã giảm giá">
      {dialog ? <Dialog open={dialog} title={titleDialog} content={contentDialog} /> : null}
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Mã giảm giá
          </Typography>
          <FormDialog parentCallback={getStoreFromChild} />
        </Stack>

        <Card>
          <UserListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={discountList.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers1
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      const { _id, name, description, endDate, percentSale, code } = row;
                      const isItemSelected = selected.indexOf(name) !== -1;

                      return (
                        <TableRow
                          hover
                          key={_id}
                          tabIndex={-1}
                          role="checkbox"
                          selected={isItemSelected}
                          aria-checked={isItemSelected}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={isItemSelected}
                              onChange={(event) => handleClick(event, name)}
                            />
                          </TableCell>
                          <TableCell component="th" scope="row" padding="none">
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Typography variant="subtitle2" noWrap>
                                {name}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="left">{code}</TableCell>
                          <TableCell align="left">{percentSale}</TableCell>
                          <TableCell align="left">{new Date(endDate).toLocaleDateString('vi-VN')}</TableCell>
                          <TableCell align="left">{description}</TableCell>

                          <TableCell align="right">
                            <UserMoreMenu idDiscount={_id}
                              dialogUpdateDiscount={dialogUpdateDiscount}
                              discountList={discountList}
                              statusDialogDelete={statusDialogDelete}
                              getStoreFromChildUpdate={getStoreFromChildUpdate}
                              parentCallback1={getStoreFromChildDelete} />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
                {isUserNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={discountList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} tổng ${count}`}
            labelRowsPerPage="Số dòng mỗi trang"
          />
        </Card>
      </Container>
    </Page>
  );
}
