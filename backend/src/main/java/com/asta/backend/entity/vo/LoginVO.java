package com.asta.backend.entity.vo;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class LoginVO {

    private Integer userId;

    private String username;

    private String token;
}
