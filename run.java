import java.io.*;

public class run {
    public static String lang(String file_name){
    

        // This Function is for the filtering the file format from the name and return the Command
        
        String format=null; 

        if(file_name.endsWith(".py")){
            format = "python3 "+file_name;  // PYTHON
        }

        else if(file_name.endsWith(".c")){
            format = "gcc "+ file_name + "-o "+ file_name.replace(".c", "") +" && ./"+  file_name.replace(".c", "");    // C
        }

         else if(file_name.endsWith(".c++") || file_name.endsWith(".cpp")){
            if(file_name.endsWith(".c++")){
            format = "gcc "+ file_name + " -o "+ file_name.replace(".c++", "") +" && ./"+ file_name.replace(".c++", "");   //C++
            }
            else if(file_name.endsWith(".cpp")){
                format = "gcc "+ file_name + " -o "+ file_name.replace(".cpp", "") +" && ./"+ file_name.replace(".cpp", "");  //Cpp
            }
        }

         else if(file_name.endsWith(".java")){
            format = "javac "+ file_name + " && java "+ file_name.replace(".java", "");   // JAVA
        }

         else if(file_name.endsWith(".php")){
            format = "php "+file_name;         //PHP
        } 

        else if(file_name.endsWith(".go")){
            format= "go run ./" + file_name;  // GO
        }
        
        else {
            return "Doesn't Support this file";
        }

        return format; 
    }


    public static String execution(String cmd){

        // This function is to run the code in the terminal and return is output or error
        
        String s=null;
        Process process;
        
       try {
            process = Runtime.getRuntime().exec(cmd);

            // Read standard output
            BufferedReader br = new BufferedReader(new InputStreamReader(process.getInputStream()));
            while ((s = br.readLine()) != null)
                System.out.println("OUT: " + s);

            // Read error output
            BufferedReader errBr = new BufferedReader(new InputStreamReader(process.getErrorStream()));
            while ((s = errBr.readLine()) != null)
                System.err.println("ERR: " + s);

            process.waitFor();
            System.out.println("exit: " + process.exitValue());
            process.destroy();
        } catch (Exception e) {
            e.printStackTrace();
        }
    
        return s;
    }


    public static void main(String args[]) {
        String code=lang("hello.java");
        System.out.println("execute: "+ code);
        System.out.println("executing......");
        System.out.println(execution(code));
        
        
    }
}
