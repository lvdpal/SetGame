package com.example;

import java.net.Inet4Address;
import java.net.UnknownHostException;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@ConfigurationProperties(prefix="helloapp")
public class HelloWorldRestController {
    private String saying;

	@CrossOrigin
    @RequestMapping(method = RequestMethod.GET, value="/hello", produces = "text/plain")
    public String sayHello() throws UnknownHostException {
        String hostName = null;
        try {
            hostName = Inet4Address.getLocalHost().getHostAddress();
        } catch (UnknownHostException e) {
            hostName = "unknown";
        }
        return saying + " " + hostName;
    }

    public String getSaying() {
        return saying;
    }

    public void setSaying(String saying) {
        this.saying = saying;
    }
}
