package com.greengadgets.backend.service;

import com.greengadgets.backend.model.CartItem;
import com.greengadgets.backend.repository.CartRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartService {

    private final CartRepository cartRepository;

    public CartService(CartRepository cartRepository) {
        this.cartRepository = cartRepository;
    }

    public List<CartItem> getAllCartItems() {
        return cartRepository.findAll();
    }

    public CartItem addCartItem(CartItem cartItem) {
        return cartRepository.save(cartItem);
    }

    public void deleteCartItem(Long id) {
        cartRepository.deleteById(id);
    }
}
