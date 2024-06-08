import * as React from "react"

// MUI 불러오기
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { styled, useTheme } from '@mui/material/styles'
import MuiCard from '@mui/material/Card'

// ** Styled Components
const Card = styled(MuiCard)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '28rem' }
}))

export default function LoginPage(props) {
  const [name2, setName2] = React.useState("");
  const [room, setRoom] = React.useState("");

  return (
    <Box className='content-center'>
      <Card sx={{ zIndex: 1 }}>
        <CardContent sx={{ padding: theme => `${theme.spacing(12, 9, 7)} !important` }}>
          <Box sx={{ mb: 6 }}>
            <Typography variant='h5' sx={{ fontWeight: 600, marginBottom: 1.0 }}>
              밥4조 아그리콜라에 온 걸
            </Typography>
            <Typography variant='h3' sx={{ fontWeight: 600, marginBottom: 1.5 }}>
              환영합니다! 👋🏻
            </Typography>
          </Box>
          <form noValidate autoComplete='off' onSubmit={e => e.preventDefault()}>
            <TextField 
              autoFocus 
              fullWidth id='room' 
              label='방 이름' 
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              sx={{ marginBottom: 4 }} 
            />
            <TextField 
              autoFocus 
              fullWidth id='name' 
              label='내 이름' 
              value={name2}
              onChange={(e) => setName2(e.target.value)}
              sx={{ marginBottom: 4 }} 
            />
            <Button
              fullWidth
              size='large'
              variant='contained'
              sx={{ marginBottom: 3 }}
              onClick={() => props.btnFunction(room, name2, "join")}
            >
              게임 시작
            </Button>
            <Button
              fullWidth
              size='large'
              variant='outlined'
              sx={{ marginBottom: 3 }}
              onClick={() => props.btnFunction(room, name2, "tutorial")}
            >
              연습 모드
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  )
}
