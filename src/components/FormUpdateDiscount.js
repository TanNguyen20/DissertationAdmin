import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import AutoFixOffIcon from '@mui/icons-material/AutoFixOff';
import AutoFixNormalIcon from '@mui/icons-material/AutoFixNormal';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';

import { useFormik } from 'formik';

import FormApi from '../api/formApi';
import * as Yup from 'yup';
import ResponsiveDialog from './Dialog';

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function generateString(length) {
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

export default function FormDialog(props) {
    const [open, setOpen] = useState(props.open);
    const [discount, setDiscount] = useState(props.discounts.find(item => item._id === props.id));
    const [dialog, setDialog] = useState(false);
    const [values, setValues] = useState({ createDiscount: false });
    const [valueDate, setValueDate] = useState(new Date(discount.endDate));
    const handleChangeDate = (newValue) => {
        setValueDate(newValue);
        formik.setFieldValue('endDate', newValue);
    };
    const handleClickCreateDiscount = () => {
        setValues({
            ...values,
            createDiscount: !values.createDiscount,
        });
        if (!values.createDiscount) {
            formik.setFieldValue('discountCode', generateString(12));
        }
        else {
            formik.setFieldValue('discountCode', '');
        }
    };

    const handleMouseDownCreateDiscount = (event) => {
        event.preventDefault();
    };
    const signUpSchema = Yup.object().shape({
        endDate: Yup.string().required('Vui l??ng nh???p ng??y k???t th??c'),
        description: Yup.string().required('Vui l??ng nh???p th??ng tin th??m'),
        name: Yup.string().required('Vui l??ng nh???p t??n m?? gi???m gi??'),
        percentSale: Yup.number().typeError('Vui l??ng nh???p s???').required('Vui l??ng nh???p ph???n tr??m gi?? ???????c gi???m').test(
            'Is positive?', 
            'Kh??ng ???????c nh???p s??? ??m', 
            (value) => value > 0
        ),
        discountCode: Yup.string().required('Vui l??ng nh???p m?? code').min(12, 'M?? code ph???i c?? ??t nh???t 12 k?? t???')
            .max(12, 'M?? code c?? t???i ??a 12 k?? t???'),
    });
    const handleClose = () => {
        setOpen(false);
        props.parentCallback(false);
        formik.handleReset();
    };

    const formik = useFormik({
        initialValues: {
            endDate: discount.endDate,
            percentSale: discount.percentSale,
            discountCode: discount.code,
            description: discount.description,
            name: discount.name,
        },
        validationSchema: signUpSchema,
        onSubmit: (values) => {
            const discountData = values;
            FormApi.updateDiscount(discountData,props.id).then(res => {
                props.updateDiscount(true);
                setDiscount(res);
                props.parentCallback(false);
                props.dataFromChild(res);
                setDialog(true);
                setOpen(false);
            }).catch(err => {
                console.log(err);
            });
        },
    });

    return (
        <div>
            {dialog ? <ResponsiveDialog open={dialog} title="Th??ng b??o"
                content="C???p nh???t th??ng tin m?? gi???m gi?? th??nh c??ng!" /> : null}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>C???p nh???t th??ng tin m?? gi???m gi??</DialogTitle>
                <DialogContent>
                    <DialogContentText mb={4} sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                        S???a th??ng tin b??n d?????i ????? c???p nh???t th??ng tin m?? gi???m gi??
                    </DialogContentText>
                    <Box component="form" noValidate onSubmit={formik.handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    name="name"
                                    required
                                    fullWidth
                                    id="name"
                                    label="T??n m?? gi???m gi??"
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
                                    id="percentSale"
                                    label="Ph???n tr??m gi???m"
                                    name="percentSale"
                                    value={formik.values.percentSale}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.percentSale && Boolean(formik.errors.percentSale)}
                                    helperText={formik.touched.percentSale && formik.errors.percentSale}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DesktopDatePicker
                                        label="Ng??y h???t h???n"
                                        required
                                        inputFormat="dd/MM/yyyy"
                                        value={valueDate}
                                        onChange={handleChangeDate}
                                        onBlur={formik.handleBlur}
                                        renderInput={(params) => <TextField {...params}
                                            name="endDate"
                                            id="endDate"
                                            error={formik.touched.endDate && Boolean(formik.errors.endDate)}
                                            helperText={formik.touched.endDate && formik.errors.endDate}
                                            required fullWidth />}
                                    />
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel htmlFor="discountCode">Nh???p m?? code</InputLabel>
                                    <OutlinedInput
                                        required
                                        id="discountCode"
                                        type="text"
                                        name="discountCode"
                                        value={formik.values.discountCode}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickCreateDiscount}
                                                    onMouseDown={handleMouseDownCreateDiscount}
                                                    edge="end"
                                                >
                                                    {values.createDiscount ? <AutoFixNormalIcon /> : <AutoFixOffIcon />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        label="Nh???p m?? code"
                                    />
                                    {formik.touched.discountCode && formik.errors.discountCode ? (
                                        <FormHelperText error>{formik.errors.discountCode}</FormHelperText>
                                    ) : null}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <TextField
                                    required
                                    fullWidth
                                    multiline
                                    rows={3}
                                    id="description"
                                    label="Nh???p th??ng tin th??m v??? m?? gi???m gi??"
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
                            <Button type="submit" >C???p nh???t th??ng tin</Button>
                        </DialogActions>

                    </Box>
                </DialogContent>
            </Dialog>
        </div>
    );
}