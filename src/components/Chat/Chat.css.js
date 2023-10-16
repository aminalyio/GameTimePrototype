import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
    chatContainer: {
        color: '#fff'
    },
    openChatButton:{
        color: '#12f20c',
        width: 50,
        height: 50,
        fontSize: "50px",
    },
    chatDialog: {
        position: 'fixed',
        right: '5%',
        top: '5%',
        zIndex: 99,
    },
    tooltipBox:{

    }
}))

export default useStyles;