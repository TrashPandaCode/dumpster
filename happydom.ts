/*
 * Authors: Jonathan Kron
 *
 * Purpose:
 * This code registers Happy DOM's global environment to simulate a
 * browser-like context for testing or running DOM-dependent code outside of a real browser.
 */
import { GlobalRegistrator } from "@happy-dom/global-registrator";

GlobalRegistrator.register();
