import { Link, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { JSX } from "react/jsx-runtime";

const testList: JSX.Element[] = [<Typography variant="h2" gutterBottom style={{textAlign: "center"}}>Title</Typography>,<br />];
for (let i = 0; i < 50; i++) {
    testList.push(<Typography variant="body1" gutterBottom >Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</Typography>  )
}

testList.push(<br/>)
testList.push(<Link href="#">You decide to make Decision A. Turn to page 214</Link>)
testList.push(<br/>)
testList.push(<Link href="#">You decide to make Decision B. Turn to page 253</Link>)


export default function MainGrid() {
    return (
      <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
        <Paper 
            elevation={3}
            sx={{
                paddingLeft: 16, 
                paddingRight: 16, 
                paddingTop: 8, 
                paddingBottom: 8, 
                marginLeft: 16, 
                marginRight: 16,
                position: "relative",
            }}
        >
            {testList}
            <Typography variant="subtitle1" sx={{textAlign: "center", position: "absolute", bottom: '8px', left: 0, right: 0}}>210</Typography>

        </Paper>
        {/* <Typography variant="subtitle1" sx={{textAlign: "center"}}>210</Typography> */}
      </Box>
    )
}