import java.io.*;

public class test {
    public static void main(String args[]) {
        String s;
        Process process;
        try {
            process = Runtime.getRuntime().exec("javac hello.java");
            BufferedReader stdout = new BufferedReader(new InputStreamReader(process.getInputStream()));
            BufferedReader stderr = new BufferedReader(new InputStreamReader(process.getErrorStream()));

            while ((s = stdout.readLine()) != null)
                System.out.println(s);
            process.waitFor();
            System.out.println ("exit: " + process.exitValue());
            while ((s= stderr.readLine()) != null) {
                  System.out.println(s);
            }
            process.destroy();
            //System.out.println("=== Error Output ===");
        } catch (Exception e) {}
    }
}


