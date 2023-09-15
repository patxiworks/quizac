import { useState } from "react";
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { getAuth, signOut } from "firebase/auth";
import { Box, TextField, Button, Menu, MenuItem, Autocomplete, InputAdornment } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import styles from "./styles/top-bar.module.css";
import { styled } from "@mui/material/styles";

const StyledAutocomplete = styled(Autocomplete)({
  "& .MuiInputLabel-outlined:not(.MuiInputLabel-shrink)": {
    // Default transform is "translate(14px, 20px) scale(1)""
    // This lines up the label with the initial cursor position in the input
    // after changing its padding-left.
    transform: "translate(34px, 20px) scale(1);"
  },
  "& .MuiAutocomplete-root": {
    display: "flex",
    flex: 1,
    justifyContent: "flex-end",
    maxWidth: "300px",
    width: "100%"
  },
  "&.Mui-focused .MuiInputLabel-formControl": {
    color: "#dbf2f4"
  },
  "&.Mui-focused .MuiInput-underline": {
    '&::after': {
      borderBottom: "2px solid #dbf2f4"
    }
  },
  "& .MuiInputBase-root.MuiInput-root.MuiInput-underline": {
    paddingRight: "0px"
  },
  "& .Mui-focused .MuiInputBase-adornedEnd": {
    paddingRight: "0px"
  },
  "& .MuiAutocomplete-inputRoot": {
    color: "#dbf2f4",
    // This matches the specificity of the default styles at https://github.com/mui-org/material-ui/blob/v4.11.3/packages/material-ui-lab/src/Autocomplete/Autocomplete.js#L90
    '&[class*="MuiOutlinedInput-root"] .MuiAutocomplete-input:first-of-type': {
      // Default left padding is 6px
      paddingLeft: 26
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "green"
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "red"
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "purple"
    }
  }
});

const TopBar = () => {
  const auth = getAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const logout = () => {
    signOut(auth).then(() => {
      // Sign-out successful.
      router.replace('/login');
    }).catch((error) => {
      // An error happened.
    });
  }

  const [
    dropdownButtonSimpleTextOAnchorEl,
    setDropdownButtonSimpleTextOAnchorEl,
  ] = useState(null);
  const dropdownButtonSimpleTextOOpen = Boolean(
    dropdownButtonSimpleTextOAnchorEl
  );
  const handleDropdownButtonSimpleTextOClick = (event) => {
    setDropdownButtonSimpleTextOAnchorEl(event.currentTarget);
  };
  const handleDropdownButtonSimpleTextOClose = () => {
    setDropdownButtonSimpleTextOAnchorEl(null);
  };

  const logoutClick = () => {
    handleDropdownButtonSimpleTextOClose();
    logout();
  }

  return (
    <div className={styles.topBar}>
      <div className={styles.logoText}>Quizac</div>
      <div className={styles.leftSection}>
        <div className={styles.searchBox}>
          <StyledAutocomplete
            id="country-select-demo"
            //sx={{ width: 500 }}
            autoHighlight
            options={cuisine}
            getOptionLabel={(option) => option.title}
            open={open}
            onInputChange={(_, value) => {
              if (value.length < 2) {
                if (open) setOpen(false);
              } else {
                if (!open) setOpen(true);
              }
            }}
            onClose={() => setOpen(false)}
            ListboxProps={{ style: {maxHeight: '450px', borderRadius: '0 0 20px 20px'}}}
            renderOption={(props, option) => (
              <Box style={{paddingTop: '15px', paddingBottom: '15px'}} component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                <img
                  loading="lazy"
                  width="50"
                  src={option.thumbnail}
                  srcSet={`${option.thumbnail} 2x`}
                  alt=""
                />
                {option.title}
              </Box>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                sx={{ width: "100%" }}
                label="Search for a quiz"
                variant="standard"
                inputProps={{
                  ...params.inputProps,
                  autoComplete: 'none', // disable autocomplete and autofill
                }}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: ( 
                    <InputAdornment position="end"> 
                      {<SearchIcon sx={{ color: "white", cursor: "pointer", fontSize: 30  }} />}
                    </InputAdornment> 
                  )
                }}
              />
            )}
          />
        </div>
        <div className={styles.userInfo}>
          <div>
            <Button
              id="button-Gerald Jones"
              aria-controls="menu-Gerald Jones"
              aria-haspopup="true"
              aria-expanded={dropdownButtonSimpleTextOOpen ? "true" : undefined}
              onClick={handleDropdownButtonSimpleTextOClick}
              color="primary"
            >
              <Image
                className={styles.userAvatarIcon}
                width={100} height={100}
                alt=""
                src="/user-avatar@2x.png"
              />
            </Button>
            <Menu
              anchorEl={dropdownButtonSimpleTextOAnchorEl}
              open={dropdownButtonSimpleTextOOpen}
              onClose={handleDropdownButtonSimpleTextOClose}
            >
              <MenuItem onClick={handleDropdownButtonSimpleTextOClose}>
                Profile
              </MenuItem>
              <MenuItem onClick={handleDropdownButtonSimpleTextOClose}>
                <Link href='/dashboard'>Dashboard</Link>
              </MenuItem>
              <MenuItem onClick={handleDropdownButtonSimpleTextOClose}>
                Settings
              </MenuItem>
              <MenuItem onClick={logoutClick}>
                Logout
              </MenuItem>
            </Menu>
          </div>
        </div>
      </div>
    </div>
  );
};

const cuisine = [
  {id:'EQGMC2mfgnf5EA',description:'This is a medicinal flavour of palmwine used for curing fever',title:'"Awonpa", a flavour of palm wine served in a glass with sticks',thumbnail:'https://lh3.googleusercontent.com/ci/AA1T9HJNWVKrR4dwX5NNFOPqRmzCrnK8gn2hiBDK6ED41ZwAdeMj9qhtWemvwRwu0bP4YHvpfQ0oBrk=s70-ci',image:'https://lh3.googleusercontent.com/Yum31T5w0YHUlRy9srmXKgx0CV8db1FxAFcegsr2YtGCLxvNqgbhZzxFscBzoH29Hw=s384'},
  {id:'QQG0xQIoNmTixQ',description:'Iru - also called locust beans - is added alongside other condiments to spice up the soup being cooked in the pot.',title:'"Inu Eran" (Cow Offal) added to cooking pot',thumbnail:'https://lh3.googleusercontent.com/ci/AA1T9HIUlB8sGvMdVnfSNUuU_VUOdV17ltoMqh9NwUZ1Lm-B1jRV0wJ6029LC5wRzI8s53QGiNFxtw=s70-ci',image:'https://lh3.googleusercontent.com/ZXtptf-sBai9Uxwg10033tjXyQJCdF7pSNtgiRhXWgB7hw7LJtB3otKDFOGc2DBv=s384'},
  {id:'gAEIZKyx9_uyjA',description:'Tomatoes are sold in large quantities inside rafia baskets at the local farmers\' market',title:'A basket of tomatoes',thumbnail:'https://lh3.googleusercontent.com/ci/AA1T9HKstXeGt87emfPpaCmEdH-BLj5ffUiHAc9Xh5PCv10CDxgbdk9BLcIU7XFRCX9zmt565GxHu7M=s70-ci',image:'https://lh3.googleusercontent.com/oIu9rf1d8rGHnTS4IFaPwMrJx2_T01QMKwg9AvK_q3c6aSXacX9FHFPeJHHmoh9RHqE=s384'},
  {id:'SgFC6vFsUUyhPw',description:'Egusi soup (left), Nigerian tomato stew (right). Many Nigerians can\'t eat soups without combining it with Nigerian tomato stew.',title:'A bowl of Egusi soup and a bowl of stew',thumbnail:'https://lh3.googleusercontent.com/ci/AA1T9HJ5juIMOmXSdiX8qtLo5uj3mWo20ZcbrEAqCQ-05xZSIevoxOY8BQFqp682MEnv64wYUa7ssw=s70-ci',image:'https://lh3.googleusercontent.com/21RSYPNvU7FOpniVor478oLUVTWFj6XThKSGgsxBixTOM181yBqt01NN6Q3QAWQtOw=s384'},
  {id:'dgF5F1LTx1s0DA',description:'One portion of Egusi soup, served for consumption in a white soup bowl. Egusi soup can be eaten with pounded yam, wheat dough, fufu, etc.',title:'A bowl of Egusi soup on a rafia table mat',thumbnail:'https://lh3.googleusercontent.com/ci/AA1T9HJvQj03kcDDQNXnarufeEOpp6uLiGaFjMvzogV4tE8JvFGWK7pkTo9Dw7n0mPk65v2vncc4uZA=s70-ci',image:'https://lh3.googleusercontent.com/pJq2UH1U2pra3XjTM7N9i6l0xt0I1Em0fV2LDcnUGfhLxM_sdGfzkPKkzRDLXuydSQ=s384'},
  {id:'agFlWb8EbyHBPg',description:'Egusi can be prepared with various leafy vegetables including pumpkin leaves, \'efo tete\' and \'efo soko\'. It is eaten with starchy solids like Amala or Eba.',title:'A bowl of Egusi soup on a table mat',thumbnail:'https://lh3.googleusercontent.com/ci/AA1T9HLwT_Sv3WlrkKsUrCdnQxi4iJu84dsQcVcPtI5t71w2Hw1GL70nyVpil0ok9WwTtjlJ8iHzYZjb=s70-ci',image:'https://lh3.googleusercontent.com/R0Na0qTbRe5LNQ9jXuHeg9nzYDHKsghaIgLRmIJndrP_Wo6evlZ5rQH8two_Y70fgBY=s384'},
  {id:'FwEHuPGOhsaGRA',description:'',title:'A Bowl of Fish and Shrimps',thumbnail:'https://lh3.googleusercontent.com/ci/AA1T9HLqU6wMUyFaShHZjwxTq_YaQsoLdDTXotWAmVNAL1mjBrQa2XE9yuYSBz0DiXw_CHRUuPwchQ=s70-ci',image:'https://lh3.googleusercontent.com/yn2BugL3auBMyyDoSYCrSPeEhxjypLpTpowGbJ6-ZiCzi0t6bcSW7nyEzqAFMinYfQ=s384'},
  {id:'0AEnVpcdmyKCOg',description:'A bowl of star anise seeds',title:'A bowl of Star Anise seeds',thumbnail:'https://lh3.googleusercontent.com/ci/AA1T9HLbjfeBDnUd3Ej8O50eZOK81aqB2zVA2NdMRQ8UnJOxgPemPYBrIpArYYRumkyxBV242fjXY-4e=s70-ci',image:'https://lh3.googleusercontent.com/3hM4MSioChIi5qlTvoCWkORZNdL6oansNiyjy00uu6ts9_na8UDvfR2qSYLXF492_iI=s384'},
  {id:'rAFqGuF29_Pb1g',description:'A bowl of white corn grains atop food sacks.',title:'A bowl of white corn grains \'Masara\'',thumbnail:'https://lh3.googleusercontent.com/ci/AA1T9HLsKcZO7Cu-jfzy6nq5s16x_lrOf9ugWMxXn9MfiOyrNtsKRNPgblHtJwuoqqklywV7xUhLdQ4=s70-ci',image:'https://lh3.googleusercontent.com/eR7yPrjbFdfQ5dtDStjcL4EaAzq5c70feJj9a7vzi52wnIfr5bqLw1w5GevotEAZVg=s384'},
  {id:'ogFCNtDhOL0XHw',description:'Coconut rice can be prepared plain, with tomato sauce or garnished with vegetables and protein.',title:'A chafing dish with garnished coconut rice',thumbnail:'https://lh3.googleusercontent.com/ci/AA1T9HK7bISZT_ftwjC8we0EuCsGgw5xfW_-erjqCW7-SuR7gsrxf-K7BNKs5U71KbtItlk0M195y9M=s70-ci',image:'https://lh3.googleusercontent.com/yS_I96BkPO9S7BCdfO67yRJa5p8i00cQKU1G8RPkmCTwVnc49vENLHCN1JlPjbZ2OA=s384'},
  {id:'BAH38LUdkMfbjA',description:'Guinea corn, black-eyed white beans, millet, corn, and brown beans in plastic basins, displayed for sale. These are major crops that are grown and eaten in northern Nigeria.',title:'A cross section of food grains',thumbnail:'https://lh3.googleusercontent.com/ci/AA1T9HIYn8m1MfLAqFdzGR3dARWfwACYubXKwAmkF90W21Fz8vbe8n8UomeMWMLd0-pEvMd5ie4ngQ=s70-ci',image:'https://lh3.googleusercontent.com/9F23pp-RLDIuMY-ZKONkCGWW8mzpwHKlcJPeNdntMRIHTj-evbxdB6qyWnIsJB-A=s384'},
  {id:'cgExDu4Dbq8Ewg',description:'A cross section of Smoked dried fish, \'Bushe Shen Kifi\', arranged for sale in small baskets atop a merchant\'s market table.',title:'A cross section of smoked dried fish, \'Bushe Shen Kifi\'',thumbnail:'https://lh3.googleusercontent.com/ci/AA1T9HJB7Knwz9mGmiZ95grWi6JX_GlCMUP9kCd81hhREiMKKlzbx3jH2iJ6QJjjKN2xfBAE8-Ox7vQ=s70-ci',image:'https://lh3.googleusercontent.com/6eUGOoQChgZNO24t6Q4K-LNE4iMyjvxSid2T2HGxSpKr0Mr2pTLqLvkYhkymqtNnzw=s384'},
  {id:'ygEE-B_H2xdOUQ',description:'A slice of lemon (Lemuntsami), ginger (Citta), cinnamon chips (Kirfa), star anise, and dried sorrel herbs (yakwan zobo) set in preparation for the Zobo drink for garnishing and flavour',title:'A cross section of Zobo ingredients',thumbnail:'https://lh3.googleusercontent.com/ci/AA1T9HLcHYYm16LnnmdfdZsGFyKRE-zISW8KEBvy81RHwoqbCAkOlc-iB-lXdSXNc6fvBYO_rgcJ3g=s70-ci',image:'https://lh3.googleusercontent.com/RrOfaX4Blm88q3DXASPoOFfiBgNrGul15Ydr5ppz9diIOe44Kedr_o3UOEwzu_gQ=s384'},
  {id:'wwGoLZeufq5MXA',description:'Kunun Gyada is a Hausa-fulani gruel, The preparation ingredients consist of raw groundnuts, local rice, sugar and if desired, Tamarind spice (\'Tsamiya\' in Hausa) for taste. A bowl of rice is divided in two halves, the first half is boiled, while the other half is ground. After 30 minutes of boiling the rice, the ground rice is added with the milk from the raw groundnuts (the groundnuts are soaked, peeled, ground and sieved). In 5 minutes, the mixture is ready and the \'Tsamiya\' spice and sugar are added. At times, people choose not to grind the local rice, only soaking it before mixing it with the groundnut milk and sugar.',title:'A cup of \'Kunun Gyada\'',thumbnail:'https://lh3.googleusercontent.com/ci/AA1T9HKQ4isTRnud_XyUH4Tdw5fAUsEPEXZgbwu5jCpobKVC95DNqWw06TTolnKN5Qbcw1o0vKzSOrEU=s70-ci',image:'https://lh3.googleusercontent.com/e6zZ7eZbsgUqbganG7nz71DsoSUsznpxPobk17qzLB1bX3vDbvSFTFZuFSrUBlXZPe8=s384'},
  {id:'6wHxRJumkYvwvw',description:'A heap of dried sorrel leaves, \'yakwan zobo\' (Centre) and \'Bagaruwa\' dried acacia (left) displayed for sale at a local farmers\' market in Kaduna',title:'A heap of dried sorrel leaves for Zobo',thumbnail:'https://lh3.googleusercontent.com/ci/AA1T9HI4WTOCuX2XJ2u3emnw95pYvOGdoVHCNdQ27MLFEtVClpK8wC5p_9X1wLtl7NbxaRlSOILs4A=s70-ci',image:'https://lh3.googleusercontent.com/cOz61kvMq3znw9ao5t5w5NTW9sv2HV0pMn-u-1B6gelAf1LWfpCUYBmwjZg8ap6oCg=s384'},
  {id:'hwE_GUwD8zvEYQ',description:'Roasted plantain served with roasted yam, grilled fish, vegetables and sauce to a customer.',title:'A Plate Of Roasts',thumbnail:'https://lh3.googleusercontent.com/ci/AA1T9HIFYVerL0vz-lv7xPOkKKEtM9AaFFEoD3NssRFRdai_RxB58jtKMXPVEI9V4huGRCjBS9oe5Vox=s70-ci',image:'https://lh3.googleusercontent.com/xxUYArd-2dKlgTw-OVntcTVDrSenrA90rEzMHiWh7To4fNfXZra529DK83t_a12tZ_o=s384'},
  {id:'WQGnoaICT3Gzkw',description:'Wild pig meat selected to be garnished with pepper and spices for slae',title:'A stick of Bush Meat',thumbnail:'https://lh3.googleusercontent.com/ci/AA1T9HLnODnjEJsfp-g5ButhzbxdzG-cingsOJngvG2w6RAalYSEsnL1ueeUjTXBc78q80Mqbub3NxI=s70-ci',image:'https://lh3.googleusercontent.com/MfVyiBQgxYshKhmLRId9VEHNhmrlAWNiCSaqhXmlwXzc1hvuhNMnieS3wcTzKQXVLw=s384'},
  {id:'pQFSWwcJLFRyNg',description:'Preparation of Akara. Adding chopped onions to ground bean batter in a bowl. One of Nigeria\'s favourite deep fried snack, Akara is a popular breakfast meal and made with brown or black-eyed beans and spices. The preparation of Akara follows a relatively simple process. It\'s all about getting the right texture and taste from the beans mixed with the ingredients.',title:'Adding ingredients to ground beans',thumbnail:'https://lh3.googleusercontent.com/ci/AA1T9HLlbyO5IEUknw8HWrGZnhjypCWwKdqrr1XkTmtUn8J9BNI7XKpgRQi1NZpG2Z9w5eQCeNB1cg=s70-ci',image:'https://lh3.googleusercontent.com/jGfQGUXXNxRc71OMVMJIab4RHSOrm5LifXAkCsHbupGYO8FT4rPf_oVt9sEz9YP8=s384'},
  {id:'NgGsBkTGH-TzGQ',description:'Preparation of peppered snail. A chef putting sliced onions in the pot of snails for flavour. Peppered snail is a Nigerian appetizer enjoyed at parties, events and in homes. It is a delicacy that is tasty, spicy and pepper. It is served using kebab sticks or as a side dish with peppered sauce.',title:'Adding onions to pot of snails',thumbnail:'https://lh3.googleusercontent.com/ci/AA1T9HKT2JRaY21Ww767rgdiSfkawO-Z-JjrFB9b--a1qxMT43VqzAPzm1pL5_1PTPpmvLmdE-fBfoE=s70-ci',image:'https://lh3.googleusercontent.com/YsL60_m-OTuBueXXtnmnzXyBjsFY67ResEJF210-9oDzaIstDf7WHZwNjAKsw51ykg=s384'},
  {id:'aAH1i9voI76QjQ',description:'',title:'Adding Stock Fish To The Pot',thumbnail:'https://lh3.googleusercontent.com/ci/AA1T9HKNB_Dy0iHwmCcI4XigIYa0Ah7iMad2JZEBlrelEotSU4tF1TSxKCcCeCNeweNa61tC6MsVQODW=s70-ci',image:'https://lh3.googleusercontent.com/YApT6gmMAwXLHAESaqozcwHwUey2N8uy37GPCwdvp6cDqhHcVUhqsHbsx-wiU7X3M-g=s384'}
  ]

const countries = [
  { code: 'AD', label: 'Andorra', phone: '376' },
  {
    code: 'AE',
    label: 'United Arab Emirates',
    phone: '971',
  },
  { code: 'AF', label: 'Afghanistan', phone: '93' },
  {
    code: 'AG',
    label: 'Antigua and Barbuda',
    phone: '1-268',
  },
  { code: 'AI', label: 'Anguilla', phone: '1-264' },
  { code: 'AL', label: 'Albania', phone: '355' },
  { code: 'AM', label: 'Armenia', phone: '374' },
  { code: 'AO', label: 'Angola', phone: '244' },
  { code: 'AQ', label: 'Antarctica', phone: '672' },
  { code: 'AR', label: 'Argentina', phone: '54' },
  { code: 'AS', label: 'American Samoa', phone: '1-684' },
  { code: 'AT', label: 'Austria', phone: '43' }]

export default TopBar;
