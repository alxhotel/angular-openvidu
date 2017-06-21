import { Component, DebugElement, Type } from '@angular/core';
import { By } from '@angular/platform-browser';
import { TestBed, ComponentFixture } from '@angular/core/testing';

/**
 * Helper Functions and test components for use in unit tests.
 */

/**
 * Get random credentials
 */
export function getRandomCredentials(): {[key: string]: string} {
	const list = 'ABCDEFGHIJKLMNPQRSTUVWXY';
	var rnd = Math.floor(Math.random() * list.length);
	return {
		sessionId: 'Session' + list.charAt(rnd),
		participantId: 'Participant' + Math.floor(Math.random() * 100)
	};
}
