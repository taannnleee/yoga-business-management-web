package org.example.yogabusinessmanagementweb.authentication.service.Impl;

import lombok.RequiredArgsConstructor;
import org.example.yogabusinessmanagementweb.authentication.dto.request.LoginRequest;
import org.example.yogabusinessmanagementweb.authentication.dto.request.RegistrationRequest;
import org.example.yogabusinessmanagementweb.authentication.dto.request.UpdateProfileRequest;
import org.example.yogabusinessmanagementweb.authentication.dto.response.ProfileResponse;
import org.example.yogabusinessmanagementweb.authentication.dto.response.RegistrationResponse;
import org.example.yogabusinessmanagementweb.authentication.exception.InvalidPasswordException;
import org.example.yogabusinessmanagementweb.authentication.exception.UserNotFoundException;
import org.example.yogabusinessmanagementweb.authentication.repositories.UserRepository;
import org.example.yogabusinessmanagementweb.authentication.service.AddressService;
import org.example.yogabusinessmanagementweb.authentication.service.UserService;
import org.example.yogabusinessmanagementweb.common.entities.Address;
import org.example.yogabusinessmanagementweb.common.entities.User;
import org.example.yogabusinessmanagementweb.common.mapper.Mappers;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


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
    public ProfileResponse getProfile(String id) {
        Optional<User>  userOptional =  userRepository.findById(Long.valueOf(id));
        if(userOptional.isEmpty()){
            throw new UserNotFoundException("User not found");
        }
        User user = userOptional.get();
        Address address =  addressService.findAddressByUser(user);
        if(address == null){
            throw new UserNotFoundException("Address not found");
        }

        ProfileResponse profileResponse = Mappers.convertToDto(user, ProfileResponse.class);
        profileResponse.setCity(address.getCity());
        profileResponse.setStreet(address.getStreet());
        profileResponse.setState(address.getState());
        return profileResponse;
    }

    @Override
    public void updateProfile(UpdateProfileRequest updateProfileRequest, String id) {
        Optional<User> userOptional = userRepository.findById(Long.valueOf(id));

        if(userOptional.isEmpty()){
            throw new UserNotFoundException("User not found");
        }

        User user = userOptional.get();

        // Cập nhật thông tin người dùng từ request
        user.setFullname(updateProfileRequest.getFullname());
        user.setUsername(updateProfileRequest.getUsername());
        user.setEmail(updateProfileRequest.getEmail());
        user.setPhone(updateProfileRequest.getPhone());

        // Cập nhật địa chỉ
        Address address = addressService.findAddressByUser(user);
        address.setCity(updateProfileRequest.getCity());
        address.setStreet(updateProfileRequest.getStreet());
        address.setState(updateProfileRequest.getState());

        // Lưu lại thông tin đã được cập nhật
        userRepository.save(user);
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
