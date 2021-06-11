import discord
from discord.ext import commands
import asyncio
import os
import subprocess
import ffmpeg
from voice_generator import creat_WAV

client = commands.Bot( command_prefix='.' )
voice_client = None

MUSICBOT_CHANNELID = 844564521771204618


@client.event # 起動処理
async def on_ready( ):
    print( 'ログインしました！' )
    print( client.user.name )
    print( client.user.id )

@client.command( ) # コマンド検知
async def join( ctx ): # joinコマンド処理
    print( '' )
    print( '#voicechannelを取得します！' )
    vc = ctx.author.voice.channel
    print( '#voicechannelに接続しました！' )
    print( '' )
    await vc.connect( )

@client.command( ) # byeコマンド処理
async def bye( ctx ):
    print( '' )
    print( '#切断しました！' )
    print( '' )
    await ctx.voice_client.disconnect( )


@client.event # イベント処理
async def on_message( message ): # メッセージ受信・取得
    msgclient = message.guild.voice_client
    if message.content.startswith( '.' ): # コマンドだったら無視
        pass
    elif message.channel.id == MUSICBOT_CHANNELID : #ミュージックチャンネルは無視
        pass
    else: # コマンド以外の処理（ 読み上げ処理 ）
        if message.guild.voice_client:
            print( 'メッセージを取得しました！' )
            print( message.content ) # コンソール出力
            creat_WAV( message.content ) # WAVファイル作成
            source = discord.FFmpegPCMAudio( "Library/output.wav" ) # ファイル形式変換
            message.guild.voice_client.play( source ) # 音声再生
        else:
            pass
    await client.process_commands( message )

client.run("**************************************************") #BOTトークン