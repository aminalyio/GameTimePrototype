import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
    chatContainer: {
        height: '90%'
    },
    inputContainer: {
        width: '100%',
        color: '#fff',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    sendMessageButton: {
        color: '#91b2ff',
        width: '20%',
        minHeight: 50,
        boxShadow: "none",
        backgroundColor: 'rgba(0, 0, 0, 0.12)'
    },
    chatMessageInput: {
        borderColor: '#fff',
        borderStyle: 'solid',
        borderRadius: 10,
        borderWidth: 1,
        width: '80%'
    },
    message: {
        alignItems: 'flex-start',
        // color: 'rgba(0, 0, 0, 0.87)',
        color: '#fff',
        backgroundColor:"#27993e",
        maxWidth:'calc(100% - 120px)',
        wordWrap: 'break-word',
        width: 300,
        // margin: 'auto',
        paddingBottom: 10,
        margin: 10,
        float: 'right',
        borderRadius:6,
        display: 'flex',
        alignSelf: 'flex-start'
    },
    blueMessage: {
        alignItems: 'flex-start',
        // color: 'rgba(0, 0, 0, 0.87)',
        // color: '#fff',
        // backgroundColor:"#4e8cff",
        color: '#263238',
        backgroundColor: '#f4f7f9',
        maxWidth:'calc(100% - 120px)',
        wordWrap: 'break-word',
        width: 300,
        // margin: 'auto',
        margin: 10,
        paddingBottom: 10,
        borderRadius:6,
        display: 'flex',
        alignSelf: 'flex-end'
    },
    messageText:{
        padding: "17px 20px",
        fontWeight: 500,
        fontSize: 14,
        lineHeight: 1.4,
        whiteSpace: 'pre-wrap',
        wordWrap: 'break-word',
        width: 'calc(100% - 90px)',
        flexDirection: 'row',
        display: 'flex'
    },
    chatName:{
        fontWeight: 500,
    }
}))

export default useStyles;