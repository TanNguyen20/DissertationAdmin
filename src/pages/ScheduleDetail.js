import { useState, useEffect } from 'react';
// material
import { Container, Stack, Typography, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

// react-router-dom
import { useParams } from 'react-router-dom';
// components
import Page from '../components/Page';
import Dialog from '../components/DialogNotify';
import DialogConfirm from '../components/DialogConfirm';
//
import FormApi from '../api/formApi';
import useGetOrderById from '../hooks/useGetOrderById';
import useGetNotifyByOrderId from '../hooks/useGetNotifyByOrderId';
import useGetAllStore from '../hooks/useGetAllStore.js';
import useGetAllEmployee from '../hooks/useGetAllEmployee.js';
// ----------------------------------------------------------------------

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export default function Notify() {
  const params = useParams();
  const [loading, orderGet] = useGetOrderById(params.id);
  const [order, setOrder] = useState(null);
  const [loadingNotify, notify] = useGetNotifyByOrderId(params.id);
  const [loadingStore, stores] = useGetAllStore();
  const [loadingEmployees, employees] = useGetAllEmployee();
  const [openDialogConfirm, setOpenDialogConfirm] = useState(false);
  const [openDialogComplete, setOpenDialogComplete] = useState(false);
  const [openDialogUpdatePaid, setOpenDialogUpdatePaid] = useState(false);
  const [openDialogSetEmployee, setOpenDialogSetEmployee] = useState(false);
  const [openDialogCancelSetEmployee, setOpenDialogCancelEmployee] = useState(false);
  const [open, setOpen] = useState(false);
  const [openNotRedirect, setOpenNotRedirect] = useState(false);
  const [content, setContent] = useState('');
  const [contentNotRedirect, setContentNotRedirect] = useState('');
  const [openDialogCanCelOrder, setOpenDialogCanCelOrder] = useState(false);
  const [employeeSelect, setEmployeeSelect] = useState('');

  const handleChange = (event) => {
    setEmployeeSelect(event.target.value);
  };

  useEffect(() => {
    // if (!loading && Object.keys(orderGet).length > 0) {
    // console.log(orderGet);
    setOrder(orderGet);
    // }
  }, [orderGet]);

  const handleCloseDialog = (status) => {
    setOpenNotRedirect(status);
  };
  const handleCloseDialogNotRedirect = (status) => {
    setOpenNotRedirect(status);
  };
  const handleClick = () => {
    setOpenDialogConfirm(true);
  };
  const handleCloseDialogConfirm = (status) => {
    setOpenDialogConfirm(status);
  };
  const handleCloseDialogConfirmCancel = (status) => {
    setOpenDialogCanCelOrder(status);
  };
  const handleCloseDialogPaid = (status) => {
    setOpenDialogUpdatePaid(status);
  };
  const handleCloseDialogSetEmployee = (status) => {
    setOpenDialogSetEmployee(status);
  };
  const handleCloseDialogCancelSetEmployee = (status) => {
    setOpenDialogCancelEmployee(status);
  };
  const handleCloseDialogComplete = (status) => {
    setOpenDialogComplete(status);
  };
  const handleClickCancel = () => {
    setOpenDialogCanCelOrder(true);
  };
  const handleClickUpdatePaid = () => {
    setOpenDialogUpdatePaid(true);
  };
  const handleClickSetEmployee = () => {
    setOpenDialogSetEmployee(true);
  };
  const handleClickCancelSetEmployee = () => {
    setOpenDialogCancelEmployee(true);
  };
  const handleClickComplete = () => {
    setOpenDialogComplete(true);
  };
  const handleAccept = (value) => {
    if (value) {
      FormApi.confirmOrder(params.id)
        .then(() => {
          setOpen(true);
          setContent('????n h??ng ???? ???????c x??c nh???n');
          if (!loadingNotify) {
            if (notify.expoPushToken) {
              const message = {
                to: notify.expoPushToken,
                sound: 'default',
                title: 'Th??ng b??o',
                body: 'B???n c?? l???ch h???n v???a ???????c x??c nh???n',
                data: { idOrder: params.id },
              };

              fetch('https://exp.host/--/api/v2/push/send', {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                  'Authorization': 'No Auth',
                  'Accept': 'application/json',
                  'Accept-encoding': 'gzip, deflate',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(message),
              })
                .then((data) => {
                  console.log(data);
                })
                .catch(err => {
                  console.log(err);
                })
            }
          }
        })
        .catch(err => {
          console.log(err);
          setContent('C?? l???i x???y ra trong qu?? tr??nh x??c nh???n l???ch h???n');
        });
    }
  };
  const handleAcceptCancel = (value) => {
    if (value) {
      FormApi.cancelOrder(params.id)
        .then(() => {
          setOpen(true);
          setContent('L???ch h???n ???? ???????c h???y');
        })
        .catch(err => {
          console.log(err);
          setContent('C?? l???i x???y ra trong qu?? tr??nh h???y l???ch h???n');
        });
    }
  };
  const handleAcceptPaid = (value) => {
    if (value) {
      FormApi.updateOrder({ "isPaid": true }, params.id)
        .then((res) => {
          setOpenNotRedirect(true);
          setOrder(res);
          setContentNotRedirect('???? x??c nh???n thanh to??n cho l???ch h???n n??y');
        })
        .catch(err => {
          console.log(err);
          setContentNotRedirect('C?? l???i x???y ra khi x??c nh???n thanh to??n cho l???ch h???n n??y');
        });
    }
  };

  const handleAcceptSetEmployee = (value) => {
    if (value) {
      let employeeInfo = {};
      employeeInfo._id = employeeSelect._id;
      employeeInfo.name = employeeSelect.fullName;
      employeeInfo.phoneNumber = employeeSelect.phoneNumber;
      employeeInfo.email = employeeSelect.email;

      FormApi.setEmployeeForOrder(employeeInfo, order._id).then((res) => {
        setOrder(res);
        setOpenNotRedirect(true);
        setContentNotRedirect('???? giao l???ch h???n cho nh??n vi??n ' + employeeSelect.fullName);
        if (!loadingNotify) {
          if (notify.expoPushToken) {
            const message = {
              to: notify.expoPushToken,
              sound: 'default',
              title: 'Th??ng b??o',
              body: 'B???n v???a ???????c giao m???t l???ch h???n m???i!',
              data: { idOrder: params.id },
            };

            fetch('https://exp.host/--/api/v2/push/send', {
              method: 'POST',
              mode: 'no-cors',
              headers: {
                'Authorization': 'No Auth',
                'Accept': 'application/json',
                'Accept-encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(message),
            })
              .then((data) => {
                console.log(data);
              })
              .catch(err => {
                console.log(err);
              })
          }
        }
      })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  const handleAcceptCancelSetEmployee = (value) => {
    if (value) {
      let employeeInfo = {};
      FormApi.setEmployeeForOrder(employeeInfo, order._id).then((res) => {
        setOrder(res);
        setOpenNotRedirect(true);
        setContentNotRedirect('???? ho??n t??c th??nh c??ng!');
        if (!loadingNotify) {
          if (notify.expoPushToken) {
            const message = {
              to: notify.expoPushToken,
              sound: 'default',
              title: 'Th??ng b??o',
              body: 'B???n c?? m???t l???ch h???n v???a ???????c qu???n l?? ho??n t??c!',
              data: { idOrder: params.id },
            };

            fetch('https://exp.host/--/api/v2/push/send', {
              method: 'POST',
              mode: 'no-cors',
              headers: {
                'Authorization': 'No Auth',
                'Accept': 'application/json',
                'Accept-encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(message),
            })
              .then((data) => {
                console.log(data);
              })
              .catch(err => {
                console.log(err);
              })
          }
        }
      })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleComplete = (value) => {
    if (value) {
      FormApi.updateOrder({ "isCompleted": true }, params.id)
        .then((res) => {
          setOpenNotRedirect(true);
          setOrder(res);
          setContentNotRedirect('???? ho??n th??nh l???ch h???n n??y');
        })
        .catch(err => {
          console.log(err);
          setContentNotRedirect('C?? l???i x???y ra khi ho??n th??nh l???ch h???n n??y');
        });
    }
  };

  if (loading || loadingStore || loadingNotify || loadingEmployees) return <>
    <h2 style={{ textAlign: "center" }}>??ang t???i th??ng tin</h2>
    <Stack alignItems="center" mt={10}>
      <CircularProgress size={80} />
    </Stack>
  </>;
  let status = "";
  if (order.isConfirmed && order.requireCancel) status = "Kh??ch h??ng y??u c???u h???y";
  else if (order.isConfirmed && !order.isCompleted) status = "???? x??c nh???n";
  else if (order.isCanceled) status = "???? h???y";
  else if (order.isCompleted) status = "???? ho??n th??nh";
  else status = "Ch??a x??c nh???n";

  return (
    <Page title="Chi ti???t l???ch h???n">
      <Container>
        {open ? <Dialog open={open}
          handleCloseDialog={handleCloseDialog}
          title="Th??ng b??o"
          url="/orders"
          content={content} /> : null}

        {openNotRedirect ? <Dialog open={openNotRedirect}
          handleCloseDialog={handleCloseDialogNotRedirect}
          title="Th??ng b??o"
          content={contentNotRedirect} /> : null}

        {openDialogConfirm ? <DialogConfirm open={openDialogConfirm}
          isAccept={handleAccept}
          handleCloseDialog={handleCloseDialogConfirm}
          title="Th??ng b??o"
          url={"/orders"} cancel="H???y b???" accept="X??c nh???n"
          content={"X??c nh???n l???ch h???n n??y?"} /> : null}

        {openDialogCanCelOrder ? <DialogConfirm open={openDialogCanCelOrder}
          isAccept={handleAcceptCancel}
          handleCloseDialog={handleCloseDialogConfirmCancel}
          title="Th??ng b??o"
          url={"/orders"} cancel="H???y b???" accept="X??c nh???n"
          content={"X??c nh???n h???y b??? l???ch h???n n??y?"} /> : null}

        {openDialogUpdatePaid ? <DialogConfirm open={openDialogUpdatePaid}
          isAccept={handleAcceptPaid}
          handleCloseDialog={handleCloseDialogPaid}
          title="Th??ng b??o" cancel="H???y b???" accept="X??c nh???n"
          content={"X??c nh???n ???? thanh to??n cho l???ch h???n n??y?"} /> : null}

        {openDialogSetEmployee ? <DialogConfirm open={openDialogSetEmployee}
          isAccept={handleAcceptSetEmployee}
          handleCloseDialog={handleCloseDialogSetEmployee}
          title="Th??ng b??o" cancel="H???y b???" accept="X??c nh???n"
          content={"Giao l???ch h???n n??y cho " + employeeSelect.fullName} /> : null}

        {openDialogCancelSetEmployee ? <DialogConfirm open={openDialogCancelSetEmployee}
          isAccept={handleAcceptCancelSetEmployee}
          handleCloseDialog={handleCloseDialogCancelSetEmployee}
          title="Th??ng b??o" cancel="H???y b???" accept="X??c nh???n"
          content={"L???ch h???n n??y ???? ???????c giao cho " + order.employeeInfo.name+' b???n c?? mu???n ho??n t??c?'} /> : null}

        {openDialogComplete ? <DialogConfirm open={openDialogComplete}
          isAccept={handleComplete}
          handleCloseDialog={handleCloseDialogComplete}
          title="Th??ng b??o"
          url={"/orders"} cancel="H???y b???" accept="X??c nh???n"
          content={"Ho??n th??nh l???ch h???n n??y?"} /> : null}

        <Typography variant="h4" sx={{ mb: 5 }}>
          Chi ti???t l???ch h???n
        </Typography>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Th??ng tin</StyledTableCell>
                <StyledTableCell align="right">M?? t???</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <StyledTableRow >
                <StyledTableCell component="th" scope="row">
                  T??n ng?????i ?????t
                </StyledTableCell>
                <StyledTableCell align="right">{order.contactInfo.name}</StyledTableCell>
              </StyledTableRow>
              <StyledTableRow >
                <StyledTableCell component="th" scope="row">
                  M?? l???ch h???n
                </StyledTableCell>
                <StyledTableCell align="right">{order._id}</StyledTableCell>
              </StyledTableRow>
              <StyledTableRow >
                <StyledTableCell component="th" scope="row">
                  Th???i gian ?????t
                </StyledTableCell>
                <StyledTableCell align="right">{new Intl.DateTimeFormat('vi-VN', { dateStyle: 'full', timeStyle: 'medium' }).format(new Date(order.createdAt))}</StyledTableCell>
              </StyledTableRow>
              <StyledTableRow >
                <StyledTableCell component="th" scope="row">
                  Th???i gian h???n
                </StyledTableCell>
                <StyledTableCell align="right">{new Intl.DateTimeFormat('vi-VN', { dateStyle: 'full', timeStyle: 'medium' }).format(new Date(order.dateAppointment))}</StyledTableCell>
              </StyledTableRow>
              <StyledTableRow >
                <StyledTableCell component="th" scope="row">
                  S??? ??i???n tho???i li??n h???
                </StyledTableCell>
                <StyledTableCell align="right">{order.contactInfo.phoneNumber}</StyledTableCell>
              </StyledTableRow>
              <StyledTableRow >
                <StyledTableCell component="th" scope="row">
                  ?????a ch???
                </StyledTableCell>
                <StyledTableCell align="right">{order.contactInfo.address}</StyledTableCell>
              </StyledTableRow>
              <StyledTableRow >
                <StyledTableCell component="th" scope="row">
                  Y??u c???u th??m
                </StyledTableCell>
                <StyledTableCell align="right">{order.contactInfo.description}</StyledTableCell>
              </StyledTableRow>
              <StyledTableRow >
                <StyledTableCell component="th" scope="row">
                  D???ch v??? ???? ?????t
                </StyledTableCell>
                <StyledTableCell align="right">{
                  order.listService.map(item => item.productName + ", ")
                }</StyledTableCell>
              </StyledTableRow>
              {
                order.combo ?
                  <StyledTableRow >
                    <StyledTableCell component="th" scope="row">
                      G??i combo
                    </StyledTableCell>
                    <StyledTableCell align="right">{
                      order.combo
                    }</StyledTableCell>
                  </StyledTableRow> : null
              }
              <StyledTableRow >
                <StyledTableCell component="th" scope="row">
                  T???ng ti???n
                </StyledTableCell>
                <StyledTableCell align="right">{order.totalPrice.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND"
                })}</StyledTableCell>
              </StyledTableRow>
              <StyledTableRow >
                <StyledTableCell component="th" scope="row">
                  ?????a ch??? c???a h??ng kh??ch ch???n
                </StyledTableCell>
                <StyledTableCell align="right">{stores.map(item => {
                  if (item.numOfStore === order.storeAddress) return item.address;
                  return null;
                })}</StyledTableCell>
              </StyledTableRow>
              <StyledTableRow >
                <StyledTableCell component="th" scope="row">
                  Thanh to??n
                </StyledTableCell>
                <StyledTableCell align="right">{order.isPaid ? "???? thanh to??n" :
                  order.isCanceled ? "Ch??a thanh to??n" :
                    <>
                      Ch??a thanh to??n
                      <Button variant="contained"
                        style={{ marginLeft: 20 }}
                        onClick={handleClickUpdatePaid}>
                        X??c nh???n thanh to??n
                      </Button>
                    </>}</StyledTableCell>
              </StyledTableRow>
              <StyledTableRow >
                <StyledTableCell component="th" scope="row">
                  Tr???ng th??i
                </StyledTableCell>
                <StyledTableCell align="right">
                  {status}
                </StyledTableCell>
              </StyledTableRow>
              {
                order.employeeInfo ?
                  <>
                    <StyledTableRow >
                      <StyledTableCell component="th" scope="row">
                        Nh??n vi??n ph???c v???
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {order.employeeInfo.name}
                      </StyledTableCell>
                    </StyledTableRow>
                    <StyledTableRow >
                      <StyledTableCell component="th" scope="row">
                        S??? ??i???n tho???i nh??n vi??n
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {order.employeeInfo.phoneNumber}
                      </StyledTableCell>
                    </StyledTableRow>
                    <StyledTableRow >
                      <StyledTableCell component="th" scope="row">
                        Email nh??n vi??n
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {order.employeeInfo.email}
                      </StyledTableCell>
                    </StyledTableRow>
                  </>
                  : null
              }
            </TableBody>
          </Table>
        </TableContainer>
        {
          !order.isCanceled && !order.isCompleted && !order.isConfirmed ?
            <Box textAlign="center">
              <Button variant="contained"
                onClick={handleClick}>
                X??c nh???n
              </Button>
            </Box> : null
        }
        {
          order.requireCancel ?
            <Box textAlign="center">
              <Button variant="contained"
                onClick={handleClickCancel}>
                H???y l???ch h???n
              </Button>
            </Box> : null
        }
        {
          order.isConfirmed && order.isPaid && !order.isCompleted ?
            <Box textAlign="center">
              <Button variant="contained"
                onClick={handleClickComplete}>
                Ho??n th??nh l???ch h???n
              </Button>
            </Box> : null
        }
        {order.isConfirmed && !order.employeeInfo ?
          <>
            <Typography variant="h4" sx={{ mb: 4 }}>Nh??n vi??n ph??? tr??ch l???ch h???n</Typography>
            <Box sx={{ minWidth: 120 }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Ch???n nh??n vi??n ph??? tr??ch</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={employeeSelect}
                  label="Ch???n nh??n vi??n ph??? tr??ch"
                  onChange={handleChange}
                >
                  {
                    employees.map(item => {
                      return <MenuItem key={item._id} value={item}>{item.fullName} ({item.email})</MenuItem>
                    })
                  }
                </Select>
                {
                  employeeSelect ?
                    <Button variant="contained"
                      sx={{ mt: 4 }}
                      onClick={handleClickSetEmployee}>
                      X??c nh???n ch???n nh??n vi??n n??y
                    </Button> : null
                }
              </FormControl>
            </Box>
          </>
          : null}
        {order.isConfirmed && order.employeeInfo && !order.isCompleted ?
          <Button variant="contained"
            sx={{ mt: 4 }}
            onClick={handleClickCancelSetEmployee}>
            Ho??n t??c giao l???ch h???n
          </Button>
          : null}
      </Container>
    </Page>
  );
}
