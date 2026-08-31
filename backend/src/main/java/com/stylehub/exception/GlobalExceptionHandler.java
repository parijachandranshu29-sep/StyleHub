package com.stylehub.exception;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String,Object>> handleNotFound(ResourceNotFoundException ex) { return build(HttpStatus.NOT_FOUND, ex.getMessage()); }
    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<Map<String,Object>> handleBad(BadRequestException ex) { return build(HttpStatus.BAD_REQUEST, ex.getMessage()); }
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Map<String,Object>> handleCreds(BadCredentialsException ex) { return build(HttpStatus.UNAUTHORIZED, "Invalid email or password"); }
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String,Object>> handleValidation(MethodArgumentNotValidException ex) {
        Map<String,String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(e -> errors.put(e.getField(), e.getDefaultMessage()));
        Map<String,Object> body = new HashMap<>();
        body.put("success",false); body.put("message","Validation failed"); body.put("errors",errors);
        return ResponseEntity.badRequest().body(body);
    }
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String,Object>> handleGeneric(Exception ex) { return build(HttpStatus.INTERNAL_SERVER_ERROR, "Error: "+ex.getMessage()); }
    private ResponseEntity<Map<String,Object>> build(HttpStatus s, String m) {
        Map<String,Object> b = new HashMap<>(); b.put("success",false); b.put("message",m);
        return ResponseEntity.status(s).body(b);
    }
}
