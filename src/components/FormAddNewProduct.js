import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Box from '@mui/material/Box';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
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
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import FormApi from '../api/formApi';
import * as Yup from 'yup';
import ResponsiveDialog from './Dialog';
export default function FormDialog(props) {

    const [open, setOpen] = useState(false);
    const [product, setProduct] = useState(null);
    const [dialog, setDialog] = useState(false);
    const [contentDialog, setContentDialog] = useState(null);
    const [titleDialog, setTitleDialog] = useState(null);
    const [image, setImage] = useState([]);
    const [combo, setCombo] = useState([]);
    useEffect(() => {
        if (product) {
            return props.parentCallback(product);
        }
    }, [product]);
    const handleChangeCombo = (event) => {
        if(event.target.checked){
            setCombo([...combo, event.target.value]);
            formik.setFieldValue('combo', [...combo, event.target.value]);
        }
        else{
            setCombo(combo.filter(item => item !== event.target.value));
            formik.setFieldValue('combo', combo.filter(item => item !== event.target.value));
        }
    };
    const handleClickOpen = () => {
        setOpen(true);
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
    const handleClose = () => {
        setOpen(false);
        setImage('');
        formik.handleReset();
    };
    const formik = useFormik({
        initialValues: {
            productName: '',
            price: '',
            combo: '',
            description: '',
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
            FormApi.addNewProduct(ProductData).then(res => {
                setProduct(res);
                setDialog(true);
                setOpen(false);
                setTitleDialog('Th??ng b??o');
                setContentDialog('Th??m s???n ph???m m???i th??nh c??ng');
            }).catch(err => {
                console.log(err);
                setDialog(true);
                setTitleDialog('Th??ng b??o');
                setContentDialog('C?? l???i x???y ra khi th??m s???n ph???m m???i');
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
    return (
        <div>
            {dialog ? <ResponsiveDialog open={dialog} title={titleDialog}
                content={contentDialog} /> : null}
            <Button
                variant="contained"
                component={RouterLink}
                to="#"
                startIcon={<Icon icon={plusFill} />}
                onClick={handleClickOpen}
            >
                Th??m s???n ph???m/d???ch v??? m???i
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Th??m s???n ph???m/d???ch v??? m???i</DialogTitle>
                <DialogContent>
                    <DialogContentText mb={4} sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                        ??i???n c??c th??ng tin b??n d?????i ????? th??m s???n ph???m/d???ch v??? m???i
                    </DialogContentText>
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
                                    <FormControlLabel control={<Checkbox name="combo" onChange={handleChangeCombo} value="combo1" />} label="Combo 1" />
                                    <FormControlLabel control={<Checkbox name="combo" onChange={handleChangeCombo} value="combo2" />} label="Combo 2" />
                                    <FormControlLabel control={<Checkbox name="combo" onChange={handleChangeCombo} value="combo3" />} label="Combo 3" />
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
                        <DialogActions>
                            <Button onClick={handleClose}>H???y b???</Button>
                            <Button type="submit" >Th??m m???i</Button>
                        </DialogActions>

                    </Box>
                </DialogContent>
            </Dialog>
        </div>
    );
}