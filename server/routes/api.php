<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::get('game', function ()    {
    return response()->json([
        'status' => 0,
        'gridSize' => 0, 
        'players' => 0, 
        'maxPlayers' => 0,
        'currentPlayer' => 0
    ]);
});

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:api');
