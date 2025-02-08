import styled from 'styled-components';
import { View, Text, Image, TextInput, TouchableOpacity, TextProps } from 'react-native';
import Constants from 'expo-constants';

export const Colors = {
    primary: '#ffffff',
    secondary: '#E5E7E8',
    tertiary: '#1F2937',
    darkLight: '#9CA3AF',
    brand: '#6D28D9',
    green: '#10B981',
    red: '#EF4444',
};

const { primary, secondary, tertiary, darkLight, brand } = Colors;

const StatusBarHeight = Constants.statusBarHeight;

export const Styledcontainer = styled(View)`
    flex: 1;
    padding: 25px;
    padding-top: ${StatusBarHeight + 10}px;
    background-color: ${primary};
`;

export const InnerContainer = styled(View)`
    flex: 1;
    width: 100%;
    align-items: center;
`;

export const WelcomeContainer = styled(InnerContainer)`
    padding: 25px;
    padding-top: 10px;
    justify-content: center;
`;

export const Avater = styled(Image)`
    width: 100px;
    height: 100px;
    margin: auto;
    border-radius: 50px;
    border-width: 2px;
    border-color: ${secondary};
    margin-bottom: 10px;
    margin-top: 10px;
`;

export const WelcomeImage = styled(Image)`
    height: 50px;
    min-width: 100px;
`;

export const PageLogo = styled(Image)`
    width: 400px;
    height: 200px;
`;

interface PageTitleProps extends TextProps {
    welcome?: boolean;
    question?: boolean;
    onemin?: boolean;
}


export const PageTitle = styled(Text)<PageTitleProps>`
    font-size: 25px;
    text-align: center;
    font-weight: bold;
    color: #008888;
    padding: 10px;

    ${(props) => props.welcome && `
        font-size: 35px;
    `}
    ${(props) => props.question && `
        font-size: 35px;
        margin-top: -120px;
    `}
        ${(props) => props.onemin && `
        font-size: 35px;
    `}
`;

interface SubTitleProps extends TextProps {
    welcome?: boolean;
    question?: boolean;
    question2?: boolean;
}



export const SubTitle = styled(Text)<SubTitleProps>`
    font-size: 25px;
    margin-bottom: 20px;
    letter-spacing: 1px;
    font-weight: bold;
    color: ${tertiary};

    ${(props) => props.welcome && `
        margin-bottom: 5px;
        font-weight: normal;
    `}

    ${(props) => props.question && `
        margin-bottom: 10px;
        font-weight: normal;
        font-size: 18px;
    `}

    ${(props) => props.question2 && `
        margin-bottom: 10px;
        font-weight: normal;
        font-size: 16px;
    `}
`;

export const StyledFromArea = styled(View)`
    width: 90%;
`;

export const StyledTextInput = styled(TextInput)`
    background-color: ${secondary};
    padding: 13px;
    padding-left: 60px;
    padding-right: 55px;
    border-radius: 5px;
    font-size: 18px;
    height: 60px;
    margin-vertical: 3px;
    margin-bottom: 10px;
    color: ${tertiary};
`;

export const StyledInputLabel = styled(Text)`
    color: ${tertiary};
    font-size: 13px;
    text-align: left;
`;

export const LeftIcon = styled(View)`
    left: 15px;
    top: 35px;
    position: absolute;
    z-index: 1;
`;

export const RightIcon = styled(TouchableOpacity)`
    left: 280px;
    top: 35px;
    position: absolute;
    z-index: 1;
`;

interface StyledButton extends TextProps {
    onemin?: boolean;
    tenmin?: boolean;
}

export const StyledButton = styled(TouchableOpacity)<StyledButton>`
    padding: 15px;
    background-color:#008888; 
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    margin-vertical: 5px;
    height: 60px; 

    ${(props) => props.onemin && `
        background-color: #00CC00 ; 
        justify-content: center;
        height: 150px; 
        width: 48%;

    `}  

    ${(props) => props.tenmin && `
        background-color: #228B22; 
        height: 150px; 
        width: 48%;
        align-self: flex-end;
    `}  
`;

export const ButtonText = styled(Text)`
    color: ${primary};
    font-size: 16px;
    text-align: center;
`;

export const MsgBox = styled(Text)`
    text-align: center;
    font-size: 13px;
`;

export const Line = styled(View)`
    height:1px;
    width: 100%;
    background-color: ${darkLight};
    margin-vertical:10px;
`;

export const ExtraView = styled(View)`
    justify-content: center;
    flex-direction: row;
    align-items: center;
    padding: 10px;
`;

export const ExtraText = styled(Text)`
    justify-content: center;
    align-content: center;
    color: ${tertiary};
    fontsize: 15px;
`;

export const TextLink =styled(TouchableOpacity)`
    justify-content: center;
    align-items: center;
`;

export const TextLinkContent = styled(Text)`
    color: ${brand};
    font-size:15px;
`;
