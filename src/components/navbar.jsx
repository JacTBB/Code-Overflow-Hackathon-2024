"use client";

import {
  HoveredLink,
  Menu,
  MenuItem,
  MenuLink,
  ProductItem,
} from "@/components/ui/navbar-menu";
import { pb } from "@/lib/db";
import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";

export default function Navbar({ className }) {
  const [active, setActive] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(pb.authStore.isValid);
  }, []);

  return (
    <div className={cn("w-screen z-50", className)}>
      <Menu setActive={setActive}>
        <p className="font-bold pr-3 border-r border-r-gray-600">
          Unnamed Financial App
        </p>
        <MenuLink href="/" setActive={setActive} item="Home">
          Home
        </MenuLink>
        <MenuLink href="/" setActive={setActive} item="Lessons">
          Lessons
        </MenuLink>
        <MenuLink href="/" setActive={setActive} item="Deals">
          Deals
        </MenuLink>
        {loggedIn ? (
          <>
            <MenuItem setActive={setActive} active={active} item="Services">
              <div className="flex flex-col space-y-4 text-sm">
                <HoveredLink href="/#">Budget Tool</HoveredLink>
                <HoveredLink href="/#">Expense Tracker</HoveredLink>
                <HoveredLink href="/#">Shared Expenses Tracker</HoveredLink>
                <HoveredLink href="/#">Wishlist</HoveredLink>
              </div>
            </MenuItem>
            <MenuItem setActive={setActive} active={active} item="My Account">
              <div className="flex flex-col space-y-4 text-sm">
                <HoveredLink href="/#">Profile</HoveredLink>
                <HoveredLink href="/#">Rewards</HoveredLink>
                <HoveredLink href="/#">Logout</HoveredLink>
              </div>
            </MenuItem>
          </>
        ) : (
          <MenuLink href="/login" setActive={setActive} item="Login">
            Login
          </MenuLink>
        )}
        {/* <MenuItem setActive={setActive} active={active} item="Products">
          <div className="  text-sm grid grid-cols-2 gap-10 p-4 w-auto">
            <ProductItem
              title="Algochurn"
              href="https://algochurn.com"
              src="https://assets.aceternity.com/demos/algochurn.webp"
              description="Prepare for tech interviews like never before."
            />
            <ProductItem
              title="Tailwind Master Kit"
              href="https://tailwindmasterkit.com"
              src="https://assets.aceternity.com/demos/tailwindmasterkit.webp"
              description="Production ready Tailwind css components for your next project"
            />
            <ProductItem
              title="Moonbeam"
              href="https://gomoonbeam.com"
              src="https://assets.aceternity.com/demos/Screenshot+2024-02-21+at+11.51.31%E2%80%AFPM.png"
              description="Never write from scratch again. Go from idea to blog in minutes."
            />
            <ProductItem
              title="Rogue"
              href="https://userogue.com"
              src="https://assets.aceternity.com/demos/Screenshot+2024-02-21+at+11.47.07%E2%80%AFPM.png"
              description="Respond to government RFPs, RFIs and RFQs 10x faster using AI"
            />
          </div>
        </MenuItem> */}
      </Menu>
    </div>
  );
}
