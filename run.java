import java.io.*;
import java.util.*;

public class run {

    // This Function is for the filtering the file format from the name and return the Command
    public static ArrayList<String> lang(String file_name){
      
        ArrayList<String> format=new ArrayList<>();


        if(file_name.endsWith(".py")){
            format.add("python3 "+file_name);  // PYTHON
        }

        else if(file_name.endsWith(".c")){
            format.add("gcc "+ file_name + "-o "+ file_name.replace(".c", ""));
            format.add("./"+  file_name.replace(".c", ""));    // C
        }

         else if(file_name.endsWith(".c++") || file_name.endsWith(".cpp")){
            if(file_name.endsWith(".c++")){
            format.add("gcc "+ file_name + " -o "+ file_name.replace(".c++", ""));
            format.add("./"+ file_name.replace(".c++", ""));     //   C++
            }
            else if(file_name.endsWith(".cpp")){
                format.add("gcc "+ file_name + " -o "+ file_name.replace(".cpp", ""));
                format.add("./"+ file_name.replace(".cpp", ""));      //   Cpp
            }
        }

         else if(file_name.endsWith(".java")){
            format.add("javac "+ file_name );
            format.add("java "+ file_name.replace(".java", ""));   // JAVA
        }

         else if(file_name.endsWith(".php")){
            format.add("php "+file_name);         //PHP
        } 

        else if(file_name.endsWith(".go")){
            format.add("go run ./" + file_name);  // GO
        }
        
        else {
            format.add("Doesn't Support this file");
        }
        return format;
        
    }

    // This function is to run the code in the terminal and return is output or error
    public static ArrayList<String> execution(ArrayList<String> cmd){

        ArrayList<String> output = new ArrayList<String>();        
        String s = null;
        Process process;
       try {
            int i = 0;
            while(i<2){
            process = Runtime.getRuntime().exec(cmd.get(i));
            // Read standard output
            BufferedReader out = new BufferedReader(new InputStreamReader(process.getInputStream()));
            while ((s = out.readLine()) != null){
                //System.out.println("OUT: " + s);
                output.add(s);                
            }

            // Read error output
            BufferedReader err = new BufferedReader(new InputStreamReader(process.getErrorStream()));
            while ((s = err.readLine()) != null){
                //System.err.println("ERR: " + s);
                output.add(s);   
            }

            process.waitFor();
           // System.out.println("exit: " + process.exitValue());
            process.destroy();
            i++;
        }
            
        } catch (Exception e) {
            e.printStackTrace();
        }
    
        return output;

    }
    public static void main(String args[]) {
        ArrayList<String> code=lang("hello.java");
        System.out.println("Going to execute this command: "+ code);
        System.out.println("executing......");
        System.out.println(execution(code));
        //execution(code);
        
    }
}
