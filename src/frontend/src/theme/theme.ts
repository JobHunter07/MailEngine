import { createTheme } from '@mui/material'

const theme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#f5f7fa',
      paper: '#fff'
    }
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true
      }
    }
  }
})

export default theme
