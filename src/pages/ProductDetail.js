import { useFormik } from 'formik';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useGetProductById from '../hooks/useGetProductById';
import FormApi from '../api/formApi';
import * as Yup from 'yup';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import ResponsiveDialog from '../components/Dialog';
import DialogAcceptResponsive from '../components/DialogAcceptResponsive';
// material
import { styled } from '@mui/material/styles';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import {
    Container, Stack, Typography, ImageList, ImageListItem, IconButton,
    Grid, TextField, Button, Box, CircularProgress
} from '@mui/material';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import DeleteIcon from '@mui/icons-material/Delete';
import DialogNotify from '../components/DialogNotify';
// components
import Page from '../components/Page';

// ----------------------------------------------------------------------
function Row(props) {
    const { row } = props;

    return (
        <>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell component="th" scope="row">
                    {new Intl.DateTimeFormat('vi-VN', { dateStyle: 'full', timeStyle: 'medium' }).format(new Date(row.dataRow.createdAt))}
                </TableCell>
                <TableCell align="right">
                    {row.infoCustomer.fullName}
                </TableCell>
                <TableCell align="right">
                    {row.dataRow.comment}
                </TableCell>
                <TableCell align="right">
                    <Button variant="text" color="primary" onClick={() => props.onClick(row.infoCustomer)}>
                        Xem chi ti???t
                    </Button>
                </TableCell>
            </TableRow>
        </>
    );
}

export default function ProductDetail(props) {
    const navigate = useNavigate();
    const [dialog, setDialog] = useState(false);
    const [contentDialog, setContentDialog] = useState(null);
    const [titleDialog, setTitleDialog] = useState(null);
    const [image, setImage] = useState([]);
    const { state } = useLocation();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [loading, productListcoment] = useGetProductById(state._id);
    const [imageList, setImageList] = useState(state.images);
    const [isDelete, setIsDelete] = useState(false);
    const [isAccept, setAccept] = useState(false);
    const [combo, setCombo] = useState(state.combo);
    const [open, setOpen]  = useState(false);
    const [infoCustomer, setInfoCustomer] = useState(null);
    const handleAcceptDelete = (status) => {
        setIsDelete(status);
    };
    const Input = styled('input')({
        display: 'none',
    });
    const signUpSchema = Yup.object().shape({
        productName: Yup.string().required('Vui l??ng nh???p t??n sp/dv'),
        description: Yup.string().required('Vui l??ng nh???p th??ng tin mi??u t??? s???n ph???m/dv'),
        price: Yup.number().typeError('Vui l??ng nh???p s???').required('Vui l??ng nh???p gi?? ti???n sp/dv'),
        image: Yup.string().required('Vui l??ng ch???n ???nh'),
    });
    const handleChangeCombo = (event) => {
        if (event.target.checked) {
            setCombo([...combo, event.target.value]);
            formik.setFieldValue('combo', [...combo, event.target.value]);
        }
        else {
            setCombo(combo.filter(item => item !== event.target.value));
            formik.setFieldValue('combo', combo.filter(item => item !== event.target.value));
        }
    };
    const handleAccept = (status) => {
        setAccept(status);
        console.log(status);
        if (status) {
            FormApi.deleteProduct(state._id).then(res => {
                console.log(res);
                setDialog(true);
                setTitleDialog('Th??ng b??o');
                setContentDialog('X??a s???n ph???m/d???ch v??? th??nh c??ng');
                navigate('/products');
            })
                .catch(err => {
                    setTitleDialog('Th??ng b??o');
                    setContentDialog('X??a s???n ph???m/d???ch v??? th???t b???i');
                });
        }
    };
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleClick = (infoCustomer) => {
        setOpen(true);
        let infoFormat = `${infoCustomer.fullName} - ${infoCustomer.phoneNumber} - ${infoCustomer.email}`;
        setInfoCustomer(infoFormat);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const handleDeleteProduct = (product) => {
        setIsDelete(true);
    };
    const formik = useFormik({
        initialValues: {
            productName: state.productName || '',
            price: state.price || '',
            combo: state.combo || [],
            description: state.description || '',
            image: '',
        },
        validationSchema: signUpSchema,
        onSubmit: async (values) => {
            // alert(JSON.stringify(values));
            // console.log(values);
            let url = "https://api.cloudinary.com/v1_1/dq7zeyepu/image/upload";
            let file = values.image;
            let listImage = [];
            for (let it = 0; it < file.length; it++) {
                try {
                    let formData = new FormData();
                    formData.append("file", file[it]);
                    formData.append("upload_preset", "kkurekfz");
                    formData.append("folder", "products");
                    let dataRes = await fetch(url, {
                        method: "POST",
                        body: formData
                    });
                    let data = await dataRes.json();
                    listImage.push({ url: data.secure_url });

                }
                catch (error) {
                    console.log('co loi xay ra khi upload anh', error);
                    setTitleDialog('Th??ng b??o');
                    setContentDialog('C?? l???i x???y ra khi upload ???nh');
                };
            }
            const ProductData = values;
            ProductData.images = listImage;
            FormApi.updateProduct(ProductData, state._id).then(res => {
                setImageList(res.images);
                setDialog(true);
                setTitleDialog('Th??ng b??o');
                setContentDialog('C???p nh???t th??ng tin s???n ph???m/d???ch v??? th??nh c??ng');
            }).catch(err => {
                console.log(err);
                setDialog(true);
                setTitleDialog('Th??ng b??o');
                setContentDialog('C?? l???i x???y ra khi c???p nh???t th??ng tin s???n ph???m/d???ch v???');
            });
        },
    });
    const handleChangeImage = (e) => {
        let arrayImages = [];
        for (let it = 0; it < e.target.files.length; it++) {
            arrayImages.push(URL.createObjectURL(e.target.files[it]));
            console.log(image);
        }
        setImage(arrayImages);
        formik.setFieldValue('image', e.target.files);
    };
    if (loading) return <>
        <h2 style={{ textAlign: "center" }}>??ang t???i th??ng tin</h2>
        <Stack alignItems="center" mt={10}>
            <CircularProgress size={80} />
        </Stack>
    </>;
    return (
        <Page title="Chi ti???t sp/dv">
            {open ? <DialogNotify open={open} title={"Chi ti???t"} 
            handleCloseDialog={(status)=>setOpen(status)}
            content={infoCustomer} /> : null}
            <Container>
                <Typography variant="h4" sx={{ mb: 5 }}>
                    Chi ti???t s???n ph???m/d???ch v???
                </Typography>
                <Typography variant="h5" sx={{ mb: 5 }}>
                    Danh s??ch h??nh ???nh s???n ph???m/d???ch v???
                </Typography>
                <ImageList sx={{ width: 500, height: 200 }} cols={3} rowHeight={164}>
                    {imageList.map((item, index) => (
                        <ImageListItem key={index}>
                            <img
                                src={`${item.url}`}
                                srcSet={`${item.url}`}
                                alt={state.productName}
                                loading="lazy"
                            />
                        </ImageListItem>
                    ))}
                </ImageList>
                <Typography variant="h5" sx={{ mt: 5, mb: 5 }}>
                    Danh s??ch b??nh lu???n ti??u c???c (????nh gi?? c?? s??? sao nh??? h??n 3)
                </Typography>
                <Paper sx={{ width: '100%' }}>
                    <TableContainer component={Paper}>
                        <Table stickyHeader aria-label="collapsible table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Th???i gian b??nh lu???n</TableCell>
                                    <TableCell align="right">T??n kh??ch h??ng</TableCell>
                                    <TableCell align="right">N???i dung b??nh lu???n</TableCell>
                                    <TableCell align="right">Chi ti???t</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {state.rating
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row, index) => {
                                        if(row.rating<3) return <Row key={index} 
                                        row={{dataRow: row, infoCustomer: productListcoment.infoUserComment[index]}} 
                                        onClick={handleClick} />;
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[1, 2, 5]}
                        component="div"
                        count={state.rating.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        labelDisplayedRows={({ from, to, count }) => `${from}-${to} trong ${count}`}
                        labelRowsPerPage="S??? d??ng tr??n trang"
                    />
                </Paper>
                <Typography variant="h5" sx={{ mb: 5 }}>
                    C???p nh???t th??ng tin s???n ph???m/d???ch v???
                </Typography>
                <div>
                    {dialog ? <ResponsiveDialog open={dialog} title={titleDialog}
                        content={contentDialog} /> : null}
                    <Box component="form" noValidate onSubmit={formik.handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    name="productName"
                                    required
                                    fullWidth
                                    id="productName"
                                    label="T??n s???n ph???m"
                                    value={formik.values.productName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.productName && Boolean(formik.errors.productName)}
                                    helperText={formik.touched.productName && formik.errors.productName}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id="price"
                                    label="Gi?? ti???n"
                                    name="price"
                                    value={formik.values.price}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.price && Boolean(formik.errors.price)}
                                    helperText={formik.touched.price && formik.errors.price}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    <label htmlFor="image">
                                        T???i l??n ???nh SP/DV
                                        <Input accept="image/*" id="image" type="file"
                                            name="image" multiple
                                            onChange={handleChangeImage} />
                                        <IconButton color="primary" aria-label="upload picture" component="span">
                                            <CameraAltIcon onChange={handleChangeImage} />
                                        </IconButton>
                                        <div style={{ color: 'rgb(255,72,66)', fontSize: 12, marginTop: 18, marginLeft: 14 }}>{formik.touched.image && formik.errors.image}</div>
                                    </label>
                                </Stack>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormGroup>
                                    <FormControlLabel control={<Checkbox name="combo" checked={combo.includes("combo1")} onChange={handleChangeCombo} value="combo1" />} label="Combo 1" />
                                    <FormControlLabel control={<Checkbox name="combo" checked={combo.includes("combo2")} onChange={handleChangeCombo} value="combo2" />} label="Combo 2" />
                                    <FormControlLabel control={<Checkbox name="combo" checked={combo.includes("combo3")} onChange={handleChangeCombo} value="combo3" />} label="Combo 3" />
                                </FormGroup>
                            </Grid>
                            {image.length > 0 ? <Stack alignItems="center" ml={2}>
                                <ImageList sx={{ width: 550, height: 500 }} cols={3} rowHeight={164}>
                                    {image.map((item, index) => (
                                        <ImageListItem key={index}>
                                            <img
                                                src={`${item}`}
                                                srcSet={`${item}`}
                                                alt={`Hinh anh ${index}`}
                                                loading="lazy"
                                            />
                                        </ImageListItem>
                                    ))}
                                </ImageList>
                            </Stack> : null}
                            <Grid item xs={12} sm={12}>
                                <TextField
                                    required
                                    fullWidth
                                    multiline
                                    rows={3}
                                    id="description"
                                    label="Nh???p m?? t??? s???n ph???m"
                                    name="description"
                                    value={formik.values.description}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.description && Boolean(formik.errors.description)}
                                    helperText={formik.touched.description && formik.errors.description}
                                />
                            </Grid>
                        </Grid>
                        <Stack spacing={4} mt={4} direction="row">
                            <Button type="submit" variant="outlined">C???p nh???t</Button>
                        </Stack>

                    </Box>
                </div>
                <Typography variant="h5" sx={{ mb: 5, mt: 5 }}>
                    X??a s???n ph???m/d???ch v???
                </Typography>
                {isDelete ? <DialogAcceptResponsive
                    parentAccept={handleAccept}
                    parentCallbackDelete={handleAcceptDelete} open={isDelete} /> : null}

                <Button variant="contained" startIcon={<DeleteIcon />}
                    onClick={handleDeleteProduct}>
                    X??a s???n ph???m/d???ch v???
                </Button>
            </Container>
        </Page>
    );
}
