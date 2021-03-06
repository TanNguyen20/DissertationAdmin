import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Box from '@mui/material/Box';
import { Link as RouterLink } from 'react-router-dom';
import plusFill from '@iconify/icons-eva/plus-fill';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import { useFormik } from 'formik';

import FormApi from '../api/formApi';
import * as Yup from 'yup';
import ResponsiveDialog from './Dialog';
export default function FormDialog(props) {

    const [open, setOpen] = useState(false);
    const [store, setStore] = useState(null);
    const [dialog, setDialog] = useState(false);
    useEffect(() => {
        if (store) {
            return props.parentCallback(store);
        }
    }, [store]);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleCloseDialog = (value)=>{
        setDialog(value);
    }
    const signUpSchema = Yup.object().shape({
        email: Yup.string()
            .email('Email không hợp lệ')
            .required('Vui lòng nhập email'),
        address: Yup.string().required('Vui lòng nhập địa chỉ'),
        longitude: Yup.string().required('Vui lòng nhập kinh độ'),
        latitude: Yup.string().required('Vui lòng nhập vĩ độ'),
        name: Yup.string().required('Vui lòng nhập tên cửa hàng'),
        numOfStore: Yup.number().required('Vui lòng nhập thứ tự cửa hàng'),
        phoneNumber: Yup.number().typeError('Vui lòng nhập số').required('Vui lòng nhập số điện thoại').min(100000000, 'Số điện thoại không hợp lệ'),
    });
    const handleClose = () => {
        setOpen(false);
        formik.handleReset();
    };
    const formik = useFormik({
        initialValues: {
            email: '',
            longitude: '',
            latitude: '',
            numOfStore: '',
            name: '',
            phoneNumber: '',
            address: ''
        },
        validationSchema: signUpSchema,
        onSubmit: (values) => {
            // alert(JSON.stringify(values, null, 2));
            FormApi.createStore(values).then(res => {
                setStore(res);
                setDialog(true);
                setOpen(false);
            })
                .catch(err => {
                    console.log(err);
                })
        },
    });
    return (
        <div>
            {dialog ? <ResponsiveDialog open={dialog} title="Thông báo" onClose={handleCloseDialog}
                content="Thêm cửa hàng mới thành công!" /> : null}
            <Button
                variant="contained"
                component={RouterLink}
                to="#"
                startIcon={<Icon icon={plusFill} />}
                onClick={handleClickOpen}
            >
                Thêm cửa hàng mới
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Thêm cửa hàng mới</DialogTitle>
                <DialogContent>
                    <DialogContentText mb={4} sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                        Điền các thông tin bên dưới để thêm cửa hàng mới
                    </DialogContentText>
                    <Box component="form" noValidate onSubmit={formik.handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    name="name"
                                    required
                                    fullWidth
                                    id="name"
                                    label="Tên cửa hàng"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.name && Boolean(formik.errors.name)}
                                    helperText={formik.touched.name && formik.errors.name}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id="numOfStore"
                                    label="Số thứ tự"
                                    name="numOfStore"
                                    value={formik.values.numOfStore}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.numOfStore && Boolean(formik.errors.numOfStore)}
                                    helperText={formik.touched.numOfStore && formik.errors.numOfStore}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Nhập địa chỉ email"
                                    name="email"
                                    autoComplete="email"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.email && Boolean(formik.errors.email)}
                                    helperText={formik.touched.email && formik.errors.email}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id="phoneNumber"
                                    label="Nhập số điện thoại"
                                    name="phoneNumber"
                                    value={formik.values.phoneNumber}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                                    helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <TextField
                                    required
                                    fullWidth
                                    multiline
                                    rows={3}
                                    id="address"
                                    label="Nhập địa chỉ cửa hàng"
                                    name="address"
                                    value={formik.values.address}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.address && Boolean(formik.errors.address)}
                                    helperText={formik.touched.address && formik.errors.address}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    name="longitude"
                                    label="Nhập kinh độ"
                                    id="longitude"
                                    value={formik.values.longitude}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.longitude && Boolean(formik.errors.longitude)}
                                    helperText={formik.touched.longitude && formik.errors.longitude}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    name="latitude"
                                    label="Nhập vĩ độ"
                                    id="latitude"
                                    value={formik.values.latitude}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.latitude && Boolean(formik.errors.latitude)}
                                    helperText={formik.touched.latitude && formik.errors.latitude}
                                />
                            </Grid>
                        </Grid>
                        <DialogActions>
                            <Button onClick={handleClose}>Hủy bỏ</Button>
                            <Button type="submit" >Thêm</Button>
                        </DialogActions>

                    </Box>
                </DialogContent>
            </Dialog>
        </div>
    );
}