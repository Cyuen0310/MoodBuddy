import React, {useState} from 'react';
import { ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { StatusBar } from 'expo-status-bar';
import { View, Text, Button, TextInputProps, Image, ImageSourcePropType } from 'react-native';
import { useRouter } from 'expo-router';
import { Formik } from 'formik';
import { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons, Octicons } from '@expo/vector-icons';
import * as Yup from 'yup';
import {
    Styledcontainer,
    InnerContainer,
    PageLogo,
    SubTitle,
    StyledFromArea,
    LeftIcon,
    RightIcon,
    StyledInputLabel,
    StyledTextInput,
    Colors,
    StyledButton,
    ButtonText,
    MsgBox,
    Line,
    ExtraText,
    ExtraView,
    TextLink,
    TextLinkContent,
    PageTitle
} from '../components/style'
const {darkLight, brand} = Colors;


const SignUpScreen = () => {
    const router = useRouter();

    const handleSubmit = () => {
        // user 驗證
        router.push('/Question');
        };
    
    const [hidePassword, setPassword] = useState(true)
    const [gender, setGender] = useState('')
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [dob, setDob] = useState(new Date());

    const onChangeDob = (event: DateTimePickerEvent, selectedDate?: Date) => {
        if (event.type === 'set') {
            const currentDate = selectedDate || dob;
            setDob(currentDate);
            setShowDatePicker(false);
        } else {
            setShowDatePicker(false);
        }
    };

    const validationSchema = Yup.object().shape({
        username: Yup.string().required('Username is required'),
        birth: Yup.date().nullable(),
        email: Yup.string().email('Invalid email format').required('Email is required'),
        password: Yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
        confirmpassword: Yup.string()
            .oneOf([Yup.ref('password') || null], 'Passwords must match')
            .required('Confirm Password is required'),
        gender: Yup.string().required('Gender is required'),
        fullName: Yup.string().nullable(),
    });
    
    return (
    <Styledcontainer>
        <StatusBar style="dark" />
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <InnerContainer>
            <PageTitle>Mood Buddy</PageTitle>
            <SubTitle>Sign Up</SubTitle>
                    <Formik 
                        initialValues={{username:'', fullname:'',email: '',DOB:dob.toLocaleDateString(), password:'', gender:'', confirmpassword:''}}
                        validationSchema={validationSchema}
                        onSubmit={(values) => {
                            console.log(values);
                            handleSubmit();
                        }}
                    >{({handleChange, handleBlur, handleSubmit, errors, values, touched}) => (
                    <StyledFromArea>
                        <UserTextInput
                            label="User Name *"
                            icon={require('./../assets/images/user.png')}
                            placeholder="User Name"
                            placeholderTextColor={darkLight}
                            onChangeText={handleChange('username')}
                            onBlur={handleBlur('username')}
                            value={values.username}
                        />
                        {errors.username && touched.username && <Text style={{ color: 'red' }}>{errors.username}</Text>}
                        
                        <UserTextInput
                            label="Full Name"
                            icon={require('./../assets/images/user.png')}
                            placeholder="Full Name"
                            placeholderTextColor={darkLight}
                            onChangeText={handleChange('fullname')}
                            onBlur={handleBlur('fullname')}
                            value={values.fullname}
                        />

                        <UserTextInput
                            label="Email Address*"
                            icon={require('./../assets/images/email.png')}
                            placeholder="ABCD@gmail.com"
                            placeholderTextColor={darkLight}
                            onChangeText={handleChange('email')}
                            onBlur={handleBlur('email')}
                            value={values.email}
                            keyboardType="email-address"
                        />
                        {errors.email && touched.email && <Text style={{ color: 'red' }}>{errors.email}</Text>}
                        
                        <UserTextInput
                            label="Date of Birth"
                            icon={require('./../assets/images/cake.png')}
                            placeholder="DD - MM - YYYY"
                            placeholderTextColor={darkLight}
                            onChangeText={handleChange('DOB')}
                            onBlur={handleBlur('DOB')}
                            value={dob.toLocaleDateString()}
                            onPress={() => setShowDatePicker(true)}
                        />
                        {showDatePicker && (
                                    <DateTimePicker
                                        value={dob}
                                        mode='date'
                                        display='default'
                                        onChange={onChangeDob}
                                    />
                                )}

                        <UserTextInput
                            label="Gender*"
                            icon={require('./../assets/images/genders.png')}
                            isPicker={true} 
                            onValueChange={(itemValue) => {
                                handleChange('gender')(itemValue);
                                setGender(itemValue); 
                            }}
                            pickerItems={[
                                { label: "Male", value: "male" },
                                { label: "Female", value: "female" },
                                { label: "Other", value: "other" }
                            ]}
                            placeholder="Select Gender" 
                            selectedValue={values.gender} 
                        />
                        {errors.gender && touched.gender && <Text style={{ color: 'red' }}>{errors.gender}</Text>}

                        <UserTextInput
                            label="Password*"
                            icon={require('./../assets/images/padlock.png')}
                            placeholder="* * * * * *"
                            placeholderTextColor={darkLight}
                            onChangeText={handleChange('password')}
                            onBlur={handleBlur('password')}
                            value={values.password}
                            secureTextEntry = {hidePassword}
                            isPassword= {true}
                            hidePassword = {hidePassword}
                            setPassword = {setPassword}
                        />
                        {errors.password && touched.password && <Text style={{ color: 'red' }}>{errors.password}</Text>}

                        <UserTextInput
                            label="Confirm Password*"
                            icon={require('./../assets/images/padlock.png')}
                            placeholder="* * * * * *"
                            placeholderTextColor={darkLight}
                            onChangeText={handleChange('confirmpassword')}
                            onBlur={handleBlur('confirmpassword')}
                            value={values.confirmpassword}
                            secureTextEntry = {hidePassword}
                            isPassword= {true}
                            hidePassword = {hidePassword}
                            //setPassword = {setPassword}
                        />
                        {errors.confirmpassword && touched.confirmpassword && <Text style={{ color: 'red' }}>{errors.confirmpassword}</Text>}

                        <StyledButton onPress={() => handleSubmit()}>
                        <ButtonText>Next</ButtonText>
                        </StyledButton>
                        <Line />
                        <ExtraView>
                            <ExtraText> Have an account already? </ExtraText>
                            <TextLink onPress={() => router.replace('/Login')}>
                                <TextLinkContent>Login</TextLinkContent>
                            </TextLink>
                        </ExtraView>
                    </StyledFromArea>)}
                    </Formik>
            </InnerContainer>
            </ScrollView>
    </Styledcontainer>
);
};

const UserTextInput = ({label, icon, isPassword = false, hidePassword, setPassword, isPicker = false, onValueChange, placeholder, pickerItems = [], ...props }:
     { label: string; icon: ImageSourcePropType; isPassword?: boolean, hidePassword?: boolean;
        setPassword?: React.Dispatch<React.SetStateAction<boolean>>; isPicker?: boolean; onValueChange?: (itemValue: string) => void;
        pickerItems?: { label: string; value: string }[]; selectedValue?: string;
        placeholder?: string;}& TextInputProps) => {
    return (
    <View>
        <LeftIcon>
        <Image source={icon} style={{ width: 30, height: 30 }}/>
        </LeftIcon>
        <StyledInputLabel>{label}</StyledInputLabel>
        {isPicker ? (
            <View style={{ marginLeft: 60 }}>
                <Picker
                    selectedValue={props.value}
                    onValueChange={onValueChange}
                    style={{
                        height: 60,
                        width: '100%',
                        backgroundColor: '#E5E7E8'
                    }}
                >
                    <Picker.Item label={placeholder} value="" enabled={false} />
                    {pickerItems.map((item) => (
                        <Picker.Item label={item.label} value={item.value} key={item.value} />
                    ))}
                </Picker>
            </View>
            ) : (
                <StyledTextInput {...props} />
            )}
        {isPassword && (
            <RightIcon>
                <Ionicons
                        name={hidePassword ? 'eye-off' : 'eye'} 
                        size={30}
                        color={darkLight}
                        onPress={() => setPassword?.(!hidePassword)} 
                    />
            </RightIcon>
        )}
    </View>
    )
}

export default SignUpScreen;