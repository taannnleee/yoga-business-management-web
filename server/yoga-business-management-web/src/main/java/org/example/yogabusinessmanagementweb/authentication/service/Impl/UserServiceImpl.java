package org.example.yogabusinessmanagementweb.authentication.service.Impl;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.example.yogabusinessmanagementweb.authentication.dto.request.LoginRequest;
import org.example.yogabusinessmanagementweb.authentication.dto.request.RegistrationRequest;
import org.example.yogabusinessmanagementweb.authentication.dto.request.UpdateProfileRequest;
import org.example.yogabusinessmanagementweb.authentication.dto.response.ProfileResponse;
import org.example.yogabusinessmanagementweb.authentication.dto.response.RegistrationResponse;
import org.example.yogabusinessmanagementweb.authentication.exception.InvalidPasswordException;
import org.example.yogabusinessmanagementweb.authentication.exception.UserNotFoundException;
import org.example.yogabusinessmanagementweb.authentication.repositories.UserRepository;
import org.example.yogabusinessmanagementweb.authentication.service.AddressService;
import org.example.yogabusinessmanagementweb.authentication.service.JwtService;
import org.example.yogabusinessmanagementweb.authentication.service.UserService;
import org.example.yogabusinessmanagementweb.common.entities.Address;
import org.example.yogabusinessmanagementweb.common.entities.User;
import org.example.yogabusinessmanagementweb.common.mapper.Mappers;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.dao.InvalidDataAccessApiUsageException;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.example.yogabusinessmanagementweb.common.Enum.ETokenType.ACCESSTOKEN;
import static org.example.yogabusinessmanagementweb.common.Enum.ETokenType.REFRESHTOKEN;


@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);

    @Autowired
    @Lazy
    private AuthencationService authencationService;

    @Autowired
    @Lazy
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AddressService addressService;

    @Autowired
    private JwtService jwtService;;

    @Override
    public List<User> getAllUser() {
        return userRepository.findAll();
    }

    @Override
    public UserDetailsService userDetailsService() {
        return username ->
                userRepository.findByUsername(username)
                        .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    @Override
    public RegistrationResponse registerUser(RegistrationRequest registrationRequest) {
        ArrayList arrayList = new ArrayList();
        Address address = new Address();
        arrayList.add(address);

        String encodedPassword = passwordEncoder.encode(registrationRequest.getPassword());
        User user = Mappers.convertToEntity(registrationRequest, User.class);
        user.setPassword(encodedPassword);
        user.setStatus(false);

        address.setUser(user);
        user.setAddresses(arrayList);
        userRepository.save(user);
        authencationService.sendOTP(registrationRequest.getEmail());

        RegistrationResponse registrationResponse = Mappers.convertToDto(user, RegistrationResponse.class);
        return registrationResponse;
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public long saveUser(User user) {
        userRepository.save(user);
        return user.getId();
    }

    @Override
    public ProfileResponse getProfile(HttpServletRequest request) {
        String access_token = request.getHeader("x-token");

        if(StringUtils.isBlank(access_token)){
            throw new InvalidDataAccessApiUsageException("Token is empty");
        }

        final String userName = jwtService.extractUsername(access_token, ACCESSTOKEN);

        Optional<User> user =  userRepository.findByUsername(userName);

        //validate xem token có hợp lệ không
        if(!jwtService.isValid(access_token, ACCESSTOKEN,user.get())){
            throw new InvalidDataAccessApiUsageException("Token is invalid");
        }

        Optional<User>  userOptional =  userRepository.findById(Long.valueOf(user.get().getId()));
        if(userOptional.isEmpty()){
            throw new UserNotFoundException("User not found");
        }
        User _user = userOptional.get();
        Address address =  addressService.findAddressByUser(_user);
        if(address == null){
            throw new UserNotFoundException("Address not found");
        }

        ProfileResponse profileResponse = Mappers.convertToDto(_user, ProfileResponse.class);
        profileResponse.setCity(address.getCity());
        profileResponse.setStreet(address.getStreet());
        profileResponse.setState(address.getDistrict());
        return profileResponse;
    }

    @Override
    public void updateProfile(UpdateProfileRequest updateProfileRequest, HttpServletRequest request) {
        String access_token = request.getHeader("x-token");

        if(StringUtils.isBlank(access_token)){
            throw new InvalidDataAccessApiUsageException("Token is empty");
        }

        final String userName = jwtService.extractUsername(access_token, ACCESSTOKEN);

        Optional<User> user =  userRepository.findByUsername(userName);

        //validate xem token có hợp lệ không
        if(!jwtService.isValid(access_token, ACCESSTOKEN,user.get())){
            throw new InvalidDataAccessApiUsageException("Token is invalid");
        }

        Optional<User>  userOptional =  userRepository.findById(Long.valueOf(user.get().getId()));
        if(userOptional.isEmpty()){
            throw new UserNotFoundException("User not found");
        }

        User _user = userOptional.get();

        // Cập nhật thông tin người dùng từ request
        _user.setFullname(updateProfileRequest.getFullname());
        _user.setUsername(updateProfileRequest.getUsername());
        _user.setEmail(updateProfileRequest.getEmail());
        _user.setPhone(updateProfileRequest.getPhone());

        // Cập nhật địa chỉ
        Address address = addressService.findAddressByUser(_user);
        address.setCity(updateProfileRequest.getCity());
        address.setStreet(updateProfileRequest.getStreet());
        address.setDistrict(updateProfileRequest.getState());

        // Lưu lại thông tin đã được cập nhật
        userRepository.save(_user);
    }


    @Override
    public Optional<User> findByPhone(String phoneNumber) {
        return userRepository.findByPhone(phoneNumber);
    }

    @Override
    public Optional<User> findByUserName(String username) {
        return userRepository.findByUsername(username);
    }

    @Override
    public boolean checkUserNotExist(RegistrationRequest registrationRequest) {
        // Kiểm tra xem mật khẩu và xác nhận mật khẩu có khớp không
        if (!registrationRequest.getPassword().equals(registrationRequest.getConfirmpassword())) {
            throw new InvalidPasswordException("Passwords do not match");
        }

        // Kiểm tra xem username, phone, hoặc email có tồn tại hay không
        boolean userExists = findByUserName(registrationRequest.getUsername()).isPresent() ||
                findByPhone(registrationRequest.getPhone()).isPresent() ||
                findByEmail(registrationRequest.getEmail()).isPresent();

        return !userExists;
    }

    @Override
    public User checkUser(RegistrationRequest registrationRequest) {
        if (!registrationRequest.getPassword().equals(registrationRequest.getConfirmpassword())) {
            throw new InvalidPasswordException("Passwords do not match");
        }

        Optional<User> optionalUserByUsername = findByUserName(registrationRequest.getUsername());

        Optional<User> optionalUserByPhone = findByPhone(registrationRequest.getPhone());

        Optional<User>optionalUserByEmail = findByEmail(registrationRequest.getEmail());

        if (optionalUserByUsername.isPresent()) {
            return optionalUserByUsername.get();
        }

        if (optionalUserByPhone.isPresent()) {
            return optionalUserByPhone.get();
        }

        if (optionalUserByEmail.isPresent()) {
            return optionalUserByEmail.get();
        }
        throw new UserNotFoundException("Username, phone or email number not found.");
    }


    @Override
    public User checkLogin(LoginRequest loginRequest) {
        User user = userRepository.findByPhone(loginRequest.getUsername()).orElse(null);
        if (user != null) {
            if (passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
                return user;
            }
        }
        return null;
    }

    @Override
    public boolean changePassword(String email, String newPassword) {
        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setPassword(newPassword);
            userRepository.save(user);
            return true;
        } else {
            return false;
        }
    }

}
