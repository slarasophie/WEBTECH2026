import javax.swing.JOptionPane;

public class Einstig {

    public static void main(String[] args) {

        int a = JOptionPane.showConfirmDialog(
                null,                           // parentComponent
                "Wollen Sie wirklich beenden?", // message
                "Programmende",                 // title
                JOptionPane.YES_NO_OPTION       // optionType
        );

    }
}
