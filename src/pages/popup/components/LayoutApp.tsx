import { ArrowsAltOutlined, FullscreenOutlined } from '@ant-design/icons';
import { Button, ConfigProvider, Layout, Menu, Select, Typography, theme } from 'antd';
import React, { useEffect, useState } from 'react';
import { goTo } from 'react-chrome-extension-router';
import { useHotkeys } from 'react-hotkeys-hook';
import PersistedState from 'use-persisted-state';
import Tabs, { IRouterComponent } from "./SideItemMenuRouting";
import LayoutChoice from './LayoutChoice';
import CommandNavigation from './CommandNavigation';
import { useStore } from './GlobalStore';

const { Paragraph, Text } = Typography;
const { Sider, Content, Footer } = Layout;

export default function LayoutApp ( props: {
    children: boolean | React.ReactFragment | React.ReactPortal | null | undefined;
} ) {


    const {darkMode, setDarkModeState} = useStore();
    enum HackToolsMode {
        web = "web",
        system = "system",
        mobile = "mobile",
        misc = "misc"
    }

    const { defaultAlgorithm, darkAlgorithm } = theme;
    
    const [ menuItems ] = useState<Array<IRouterComponent>>( Tabs );
    const hackToolsState = PersistedState<string>( "hack_tools_mode" );
    const [ hackTools, setHackToolsState ] = hackToolsState();
    const isMac = navigator.platform.toUpperCase().includes( 'MAC' );
    const keySymbol = isMac ? '⌘' : 'CRTL';

    const handleSwtichTheme = ( value: string ) => {
        const isDarkMode = value === 'dark';
        setDarkModeState( isDarkMode );
    }

    const MenuItemsLists = menuItems.filter( item => item.type === hackTools ).map( ( item: IRouterComponent ) => {
        return (
            <Menu.Item key={item.key} icon={item.icon} onClick={() => navigate( item )}>
                {item.name}
            </Menu.Item>
        );
    } );

    /*----------- HOTKEYS -----------*/
    useHotkeys( 'ctrl+alt+1', () => {
        setHackToolsState( HackToolsMode.web );
        setIndex( '1' );
        goTo( Tabs.filter( item => item.type === HackToolsMode.web )[ 0 ].componentRoute );
    } );
    useHotkeys( 'ctrl+alt+2', () => {
        setHackToolsState( HackToolsMode.system );
        setIndex( '1' );
        goTo( Tabs.filter( item => item.type === HackToolsMode.system )[ 0 ].componentRoute );
    } );
    useHotkeys( 'ctrl+alt+3', () => {
        setHackToolsState( HackToolsMode.mobile );
        setIndex( '1' );
        goTo( Tabs.filter( item => item.type === HackToolsMode.mobile )[ 0 ].componentRoute );
    } );
    useHotkeys( 'ctrl+alt+4', () => {
        setHackToolsState( HackToolsMode.misc );
        setIndex( '1' );
        goTo( Tabs.filter( item => item.type === HackToolsMode.misc )[ 0 ].componentRoute );
    } );

    useHotkeys( 'ctrl+alt+c', () => {
        setHackToolsState( HackToolsMode.misc );
        setIndex( Tabs.filter( item => item.name === "Checklist" )[ 0 ].key );
        // go to the methodology page
        goTo( Tabs.filter( item => item.type === HackToolsMode.misc )[ 1 ].componentRoute );
    } );
    /*--------------------------------*/

    const useMenuIndex = PersistedState<string>( 'tab_index_cache' ); // Disabled for now
    const [ index, setIndex ] = useMenuIndex( '1' );

    const navigate = ( { componentRoute, key }: { componentRoute: React.FunctionComponent; key: string } ) => {
        goTo( componentRoute );
        setIndex( key );
    };

    const windowMode = () => {
        const width = 1100;
        const height = 800;

        chrome.windows.create( {
            url: chrome.runtime.getURL( '/src/pages/popup/index.html' ),
            width: width,
            height: height,
            type: 'popup'
        } );
    };

    useEffect( () => {
        const currentIndexPage = parseInt( localStorage.getItem( "tab_index_cache" ).replace( /"/g, '' ) ) - 1 || ( 0 );
        const currentComponent = Tabs.filter( ( tab ) => tab.type === hackTools )[ currentIndexPage ].componentRoute || ( LayoutChoice );
        goTo( currentComponent );
    }, [ index ] );

    const target = window.location.href;

    const handleHatClick = () => {
        goTo( LayoutChoice )
    };

    const currentLogobasedOnMode = () => {
        if ( hackTools === HackToolsMode.system ) {

            return ( <svg width="45" height="35" viewBox="0 0 145 232" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M84.5 170L129 156C128.4 155 129.7 153.2 129.5 152L86 166C86.7 166.9 84.1 168.8 84.5 170ZM45 169L60.6 118.2C59.4 118 58.4 117.6 57.4 117L41.5 170C42.6 170.3 44.1 168.3 45 169Z" fill="#F1F1F1" />
                <path d="M118.5 38.5L127.5 31.5L137.5 23.5L135 21.7L117.3 35.7L118.5 38.5ZM96.5 28.5L89.5 5.5L87 6.5L94 29.5L96.5 28.5Z" fill="#F1F1F1" />
                <path d="M84.5 202L77.5 179L75 180L82 203L84.5 202Z" fill="#F1F1F1" />
                <path d="M101.6 130.7C101.6 130.6 101.6 130.6 101.6 130.7C101 130.6 100.5 130.6 100 130.5L88 146.2L64 101.4V108.7L84.4 146.8C86.2 147.7 88.1 148.5 90 149.1L102.9 132.2C102.6 131.7 102.1 131.2 101.6 130.7ZM140 76L118.9 57V61.6L140 81C140.6 80 139.1 76.8 140 76ZM140 76.5L121.6 107.3C122.2 107.8 122.8 108.4 123.4 108.9C123.7 109.2 123.9 109.5 124.2 109.7L140 82V81V76.5Z" fill="#F1F1F1" />
                <path d="M64.0912 47.4V41.6C64.0912 24 76.1912 9.20002 92.5912 5.10002C92.0912 4.00002 91.8912 2.70002 91.8912 1.40002C91.8912 0.900017 91.8912 0.400015 91.9912 1.52588e-05C73.0912 4.40002 58.9912 21.4 58.9912 41.7V47.4C59 47.4 61.5 47.4 61.5 47.4H64.0912ZM111.491 1.52588e-05C111.591 0.500015 111.591 0.900017 111.591 1.40002C111.591 2.50002 111.291 4.00002 110.891 5.10002C127.291 9.20002 139.391 24 139.391 41.6V87.7C139.391 87.7 141.491 89.2 142.391 89.2C143.291 89.2 144.15 87.8354 144.691 87.7L144.591 41.6C144.491 21.4 130.391 4.40002 111.491 1.52588e-05ZM91.4912 193.8L69.2912 215.7C62.1912 222.8 52.6912 226.7 42.6912 226.7C34.4912 226.7 20.2912 219.3 20.2912 219.3C19.5912 220.9 18.3912 222.3 16.9912 223.3C16.9912 223.3 33.2912 231.9 42.6912 231.9C54.0912 231.9 64.8912 227.4 72.9912 219.4L95.1912 197.4L91.4912 193.8ZM45.7912 132.7L42.1912 129.1L12.4912 158.8C-0.808781 172.1 -3.50878 192.2 4.49122 208.2C5.69122 207 7.29122 206.1 8.99122 205.7C2.09122 191.6 4.49122 174.1 16.0912 162.5L45.7912 132.7ZM139.391 87.7V112.9C139.391 119.1 137.891 125 135.091 130.4C133.491 122.1 129.391 114.5 123.391 108.5C121.991 107.1 120.491 105.8 118.991 104.6V41.6C118.991 32.1 111.291 24.4 101.791 24.4C92.2912 24.4 84.5912 32.1 84.5912 41.6L84.6912 93.7C84.6912 93.7 85.8107 93.7 87.2107 93.7C88.6107 93.7 89.8912 93.7 89.8912 93.7L89.7912 41.6C89.7912 35 95.1912 29.5 101.891 29.5C108.491 29.5 113.991 34.9 113.991 41.6V101.2C107.691 97.7 100.591 95.8 93.2912 95.8C92.1912 95.8 90.9912 95.9 89.8912 95.9V93.7C89.8912 93.7 88.6107 93.7 87.2107 93.7C85.8107 93.7 84.6912 93.7 84.6912 93.7V112.8C84.6912 117.9 86.9912 122.7 90.8912 126C93.8912 128.5 97.7912 129.9 101.691 130L101.791 130.1C104.091 132.4 105.291 135.4 105.291 138.6C105.291 141.8 103.991 144.8 101.791 147.1L98.5912 150.3C88.9912 149.5 80.1912 145 73.6912 137.7C67.6912 130.9 64.3912 122.3 64.2912 113.2V94.7C64.2912 94.7 63.1656 94.7 61.7656 94.7C60.3656 94.7 59.0912 94.7 59.0912 94.7V112.2L42.1912 129.1L45.7912 132.7L59.4912 119C60.5912 126.4 63.5912 133.3 68.1912 139.2L30.5912 176.8C27.3912 180 25.5912 184.4 25.5912 189C25.5912 193.6 27.3912 197.9 30.5912 201.2C33.7912 204.4 38.1912 206.2 42.7912 206.2C47.3912 206.2 51.6912 204.4 54.9912 201.2L101.391 154.8L105.391 150.8C108.591 147.6 110.391 143.2 110.391 138.6C110.391 134 108.591 129.7 105.391 126.4C104.991 126 104.691 125.7 104.291 125.4C101.291 122.9 97.4912 121.5 93.4912 121.4C91.1912 119.1 89.8912 116 89.8912 112.8V101.1C98.8912 100.3 107.791 102.7 115.091 107.9C116.891 109.1 118.491 110.5 119.991 112C126.891 118.9 130.791 128 130.991 137.8V138.7C130.991 148.8 127.091 158.2 119.991 165.3L91.4912 193.8L95.1912 197.4L123.591 169C131.691 160.9 136.091 150.2 136.091 138.7V138.6C141.691 131.1 144.691 122.3 144.691 112.9V87.7C143.891 87.9 143.291 89.2 142.391 89.2C141.491 89.2 140.191 87.9 139.391 87.7ZM51.1912 197.6C48.8912 199.9 45.8912 201.1 42.6912 201.1C39.4912 201.1 36.4912 199.8 34.1912 197.6C31.8912 195.3 30.6912 192.3 30.6912 189.1C30.6912 185.9 31.9912 182.8 34.1912 180.6L71.5912 143.2C77.7912 149.3 85.4912 153.4 93.8912 155L51.1912 197.6Z" fill="white" />
            </svg> )
        } else if ( hackTools === HackToolsMode.web ) {
            return ( <svg width="45" height="35" viewBox="0 0 353 262" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M86.4667 1.46666C75.4 2.66666 67.5334 5.46666 58.2 11.4667C51.4 15.7333 48.8667 18.2667 50.0667 19.4667C50.3334 19.7333 56.8667 17.0667 64.6 13.3333C76.4667 7.46666 80.0667 6.39999 88.7334 5.73332C95.5334 5.19999 99 5.46666 99 6.39999C99 7.19999 102.333 12.1333 106.467 17.6C110.467 22.9333 115.933 31.0667 118.467 35.6C121 40 123.933 44.5333 125.133 45.4667C126.467 46.5333 126.867 48.2667 126.333 50.8C125.8 53.3333 127.8 60.8 133.667 76.8C140.467 95.6 141.533 99.8667 140.333 102.4C139.667 104.133 138.467 105.333 137.8 105.067C137.133 104.8 130.867 98.4 124.067 90.8C115.267 81.0667 109.4 75.7333 104.067 72.8L96.3334 68.6667L92.0667 71.2C89.4 72.6667 80.7334 74.6667 69.6667 76.1333C59.8 77.6 51 79.4667 50.2 80.4C43.8 87.0667 -0.333294 170.533 0.733373 173.733C1.00004 174.667 6.20004 165.467 12.3334 153.333C26.8667 124.133 36.0667 108 44.6 96.6667L51.6667 87.3333L73 83.0667C84.8667 80.6667 95.9334 79.0667 98.0667 79.4667C100.6 80 106.2 85.2 116.067 96.2667C123.933 105.067 130.6 112.8 130.733 113.467C131 114.133 129.667 114.667 127.8 114.667C125.8 114.667 123.667 115.733 122.733 117.467C121.8 118.933 117.533 122 113.4 124.133C109.267 126.267 104.733 129.467 103.4 131.467C102.067 133.333 97.6667 138.667 93.5334 143.467C87 150.933 65.6667 184.4 65.6667 187.067C65.6667 187.6 66.4667 188 67.4 188C68.8667 188 74.3334 180.133 84.7334 163.2C89.9334 154.667 102.867 141.467 108.867 138.4C111.8 136.933 117.4 133.333 121.267 130.533C128.867 124.8 130.467 124.533 134.2 127.333C135.667 128.4 139.533 129.333 142.867 129.333C146.2 129.333 151.4 130.4 154.467 131.6L160.067 133.867L159.4 141.333C155.933 186.4 155.267 196.8 155.8 197.2C157.267 198.667 158.333 194.533 161.133 175.733C163.667 159.467 169.267 138.133 171.8 134.8C172.067 134.533 173.267 135.6 174.6 137.2C176.867 140 177.133 140.133 182.2 138C190.333 134.533 194.067 136.267 208.333 149.867C223.133 164.267 229.667 169.333 233 169.333C234.333 169.333 238.6 167.6 242.333 165.467L249.267 161.467L255.267 167.733C258.467 171.2 262.2 175.733 263.533 177.733C264.867 179.867 267.933 182.4 270.333 183.467C274.333 185.067 276.2 188 287.667 210.267C301.4 237.467 316.733 260.4 321.4 261.067C325 261.6 325.133 260.4 321.8 256.8C314.867 249.067 302.733 228.8 290.867 205.067C283.667 190.533 277.667 178 277.667 177.067C277.667 176.133 273.133 170.8 267.533 165.2L257.4 155.067L261.667 142.667C265.267 132.267 265.8 128.8 265.533 120.133L265 110L283.533 109.867H302.2L309.533 114.8C313.667 117.6 321.267 123.733 326.333 128.4C334.067 135.467 337 137.2 342.733 138.533C351.4 140.4 352.333 140.4 352.333 138.667C352.333 137.867 350.867 136.667 349 136C347.133 135.333 336.867 128.533 325.933 120.8C297.267 100.533 296.067 100 276.6 100C260.467 100 260.467 100 258.067 96.4C253.4 89.4667 241 77.8667 234.867 74.9333C224.2 69.7333 215.533 68.5333 206.867 71.0667C191.8 75.4667 181.667 86.4 180.6 99.4667C180.067 105.2 179.533 106.667 178.067 106.133C177 105.733 175.8 105.333 175.533 105.333C173.8 105.333 175.933 99.3333 183 83.7333C191 66.4 192.467 60.1333 189.4 57.6C188.467 56.9333 183.933 56 179.4 55.7333L171 55.2L159 67.4667C152.467 74.1333 147 80.2667 147 81.2C147 84.5333 150.867 82.1333 159.667 73.3333C167.933 65.0667 169.533 64 173.933 64C177.267 64 179 64.6667 179 65.8667C179 67.7333 166.067 96.9333 164.067 99.4667C162.867 101.067 152.867 99.8667 151.133 97.8667C149 95.3333 133.667 48.4 133.667 44.2667C133.667 40.9333 132.467 38.8 128.467 34.9333C125.667 32.2667 119.933 24.4 115.667 17.6C111.4 10.8 106.467 3.99999 104.6 2.53332C101.133 -0.133345 100.6 -0.266678 86.4667 1.46666Z" fill="white" />
            </svg> )
        }
        else if ( hackTools === HackToolsMode.mobile ) {
            return (
                <svg width="45" height="35" viewBox="0 0 65 92" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M45.3632 6.13385C36.2017 3.17427 28.5084 0.721429 28.2529 0.661561C27.6663 0.531583 26.3407 0.798235 25.7476 1.16561C25.4373 1.35273 25.1151 1.69591 24.781 2.19518C24.3063 2.89004 23.6233 4.96391 12.3499 39.8502C5.66899 60.5148 0.398668 76.9767 0.376552 77.2666C0.332462 78.0795 0.509577 78.8151 0.955889 79.4905C1.71463 80.6562 1.09881 80.4388 19.6947 86.4281C28.9711 89.41 36.7106 91.8439 36.9919 91.8609C37.6436 91.9017 38.5781 91.6455 39.2056 91.2404C40.3182 90.5314 40.099 91.1113 45.1794 75.3748C47.747 67.4706 53.1013 50.8491 57.1153 38.449C61.2372 25.6938 64.4363 15.6265 64.4858 15.2715C64.5677 14.4929 64.2257 13.332 63.7194 12.7373C62.9419 11.8168 62.9196 11.8151 45.3632 6.13385ZM51.5214 11.2459C52.033 12.007 51.6906 12.9093 50.8144 13.1654C50.2879 13.3046 50.1953 13.2841 46.226 11.99C42.5364 10.7935 42.1573 10.6479 41.9462 10.3582C41.6252 9.9211 41.5649 9.47701 41.7515 9.02928C41.9399 8.55926 42.4319 8.22449 42.8881 8.24136C43.1608 8.2532 50.7665 10.6186 51.1199 10.8071C51.2074 10.8362 51.3807 11.0333 51.5214 11.2459ZM60.4719 19.4997C60.4616 19.5169 55.9546 33.4402 50.4703 50.415C44.9722 67.3934 40.4327 81.4488 40.3607 81.6272L40.2271 81.9669L22.7583 76.3147C13.1456 73.2131 5.27392 70.63 5.26361 70.5888C5.24985 70.5339 7.94754 62.1597 11.2409 51.9741C14.5308 41.7747 19.0601 27.7365 21.3144 20.7637C24.7293 10.2196 25.4483 8.08575 25.5992 8.10623C25.8068 8.14898 45.9876 14.6449 45.9979 14.6861C46.0013 14.6998 42.173 19.4355 37.4895 25.2093C32.7974 30.978 28.9708 35.7497 28.9982 35.8011C29.0068 35.8646 30.2194 35.9616 31.6806 36.0327C33.1367 36.1124 34.3372 36.1906 34.3407 36.2043C34.3475 36.2317 18.9386 58.9528 17.6176 60.8658C17.3314 61.2656 17.1841 61.5504 17.2612 61.48C17.532 61.2809 45.7725 33.0983 45.7553 33.0298C45.7485 33.0023 44.6474 32.9138 43.3028 32.8426C41.9582 32.7714 40.8606 32.6966 40.8502 32.6555C40.8262 32.6178 44.7293 29.4306 49.4946 25.5827L58.1612 18.57L59.0944 18.8609C60.0464 19.1981 60.5284 19.4054 60.4719 19.4997ZM39.0047 7.17358C39.5334 7.88669 39.1772 8.85076 38.2822 9.11885C36.7767 9.5691 35.9626 7.60083 37.3169 6.78023C37.6323 6.58453 38.2892 6.55841 38.6117 6.74C38.6803 6.78111 38.8537 6.97816 39.0047 7.17358ZM23.057 79.5712C23.5083 80.0632 23.8297 81.1417 23.7117 81.8055C23.6246 82.3012 23.1123 83.1367 22.6718 83.4439C21.7975 84.0859 20.2918 84.0696 19.5162 83.4184C18.4832 82.5547 18.1942 81.0525 18.8469 79.9631C19.3969 79.0453 20.5593 78.5644 21.6228 78.7935C22.4632 78.9474 22.5318 78.9885 23.057 79.5712Z" fill="white" />
                </svg>
            )
        } else if ( hackTools === HackToolsMode.misc ) {
            return ( <svg xmlns='http://www.w3.org/2000/svg' width='45' height='35' viewBox='0 0 134.624 80.584'>
                <g transform='translate(-6.457 -23.8)'>
                    <path
                        d='M138.715,62.377c-9.043-1.871-15.592.78-21.673,4.989l-5.616-26.958-2.18-10.463a1.432,1.432,0,0,0-.624-.936c-.312-.156-6.86-4.21-32.431-4.21s-34.458,4.678-34.77,4.834c-.468.312-.78.624-.78,1.091L36.9,57.543c-4.678,0-19.022.624-26.039,9.2C7.119,71.264,6.651,78.125,9.3,84.829c4.054,9.979,14.033,16.839,26.506,18.087a80.594,80.594,0,0,0,8.42.468c21.985,0,40.071-8.887,52.389-16.06,1.559-.468,11.538-3.274,24.635-8.42,14.812-5.769,18.554-14.033,18.71-14.5a2.163,2.163,0,0,0,0-1.4C139.495,62.689,139.183,62.377,138.715,62.377ZM43.448,32.128c2.495-1.091,11.694-4.21,32.743-4.21,20.581,0,28.377,2.651,30.248,3.43L111.585,56.3a165.118,165.118,0,0,1-40.851,8.887C51.088,66.9,41.733,63,39.238,61.6ZM95.058,84.517c-13.409,7.8-33.991,17.931-59.094,15.436-11.382-1.247-20.27-7.328-24.012-16.216-2.183-5.613-1.871-11.382,1.091-14.968,5.925-7.328,18.554-8.108,23.232-8.108L34.249,74.694a1.367,1.367,0,0,0,.78,1.559c9.979,6.081,21.049,8.264,31.5,8.264,16.216,0,31.34-5.145,40.7-9.043A85,85,0,0,1,95.058,84.517ZM120,75.942C114.236,78.125,109.091,80,104.881,81.4c2.183-1.715,4.054-3.43,6.081-5.145,7.172-6.237,13.1-11.382,21.829-11.382a19.881,19.881,0,0,1,2.962.156C134.038,67.522,129.516,72.356,120,75.942Z'
                        transform='translate(0 0)'
                        fill='#F0F2F5'
                        stroke='#F0F2F5'
                        strokeWidth='2'
                    />
                </g>
            </svg> )
        }
    };

    return (
        <ConfigProvider
            theme={{
                "token": {
                    "wireframe": true,
                },
                algorithm: darkMode ? darkAlgorithm : defaultAlgorithm,
            }}

        >
            <Layout style={{ minHeight: '100vh' }}>
                <Sider
                    collapsed={true}
                    style={{
                        overflow: 'auto',
                        height: '100vh',
                        position: 'fixed',
                        left: 0
                    }}
                >
                    <div className='logo' onClick={handleHatClick}>
                        {currentLogobasedOnMode()}
                    </div>

                    <Menu theme='dark' defaultSelectedKeys={[ index ]} mode='inline'>
                        {MenuItemsLists}
                    </Menu>
                </Sider>
                <Layout className='site-layout' style={{ marginLeft: 80 }}>
                    <Content style={{
                        margin: '24px 16px 0',
                        overflow: 'initial',
                        minHeight: 360,
                        padding: 14,
                        borderRadius: 8,
                        background: darkMode ? '#0f0f0f' : '#fff',
                    }}>
                        {props.children}
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>
                        © Hack Tools - The all in one browser extension for offensive security professionals -
                        <Paragraph style={{ textAlign: 'center' }}>Ludovic COULON - Riadh BOUCHAHOUA</Paragraph>
                        <pre style={{ textAlign: 'center' }}>
                            <span>
                                <Text keyboard>{keySymbol}</Text> + <Text keyboard>k</Text> to open the menu
                            </span>
                        </pre>
                        <Button icon={<FullscreenOutlined style={{ margin: 5 }} />} type='link'>
                            <a href={target} rel='noreferrer noopener' target='_blank'>
                                Fullscreen mode
                            </a>
                        </Button>
                        <Select
                            defaultValue={darkMode ? 'dark' : 'light'}
                            style={{ width: 150 }}
                            onChange={handleSwtichTheme}
                            options={[
                                {
                                    value: 'light',
                                    label: 'Light',
                                },
                                {
                                    value: 'dark',
                                    label: 'Dark',
                                },
                            ]}
                        />
                        <Button icon={<ArrowsAltOutlined style={{ margin: 5 }} />} onClick={() => windowMode()} type='link'>
                            Pop-up mode
                        </Button>
                    </Footer>
                    <CommandNavigation darkMode={darkMode} setDarkMode={setDarkModeState} />
                </Layout>
            </Layout >
        </ConfigProvider >
    );
}
