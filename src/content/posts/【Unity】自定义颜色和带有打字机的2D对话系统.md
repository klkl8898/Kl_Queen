---
title: '【Unity]自定义颜色和带有打字机的2D对话系统'
published: 2025-07-06
tags: ['Unit2D','C#']
categories: 'Unity'
image: 'https://tc.z.wiki/autoupload/f/JvYbp0k8UX_P8uybXlHYNrKXl_QqVl-bpSwqP4fJO68/20250805/TRSM/512X486/Cover.png'
---
# 对话数据SO
首先创建一个存储对话数据的ScriptableObject，其中有四个数据：对话文本集合，打字机间隔时间集合，文本颜色数组，执行完这个对话后是否关闭对话框
```
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

[CreateAssetMenu(fileName = "DiaLog", menuName = "UHM_Example/DiaLog", order = 0)]
public class DiaLog : ScriptableObject
{
    public List<string> Commands;
    public List<float> times;
    public Color[] colors;
    public bool Close;
}


```
# 打字机协程
原理：for遍历全部需要显示的文字，间隔一定时间用string的Substring截取字符串赋值给text文本
直接上代码
```csharp
IEnumerator CallWord(string s, float time, Color color)
    {
        text.text = "";//这个text是文本变量 需要在unity中自己创建文本并赋值
        for (int i = 0; i <= s.Length; i++)
        {
            text.text = s.Substring(0, i);
            yield return new WaitForSeconds(time);
        }
            while (!Input.GetKeyDown(KeyCode.Z))
            {
                yield return null;
            }  
        text.color = Color.white;
    }
```
# 单行对话/多行对话调用
本质上就是循环调用打字机协程
```csharp
public void SendList(DiaLog dl)
    {

        StartCoroutine(sendList(dl));
    }
    public IEnumerator sendList(DiaLog dl)
    {
        for (int i = 0; i < dl.Commands.Count; i++)
        {
            text.color = dl.colors[i];
            yield return StartCoroutine(CallWord(dl.Commands[i], dl.times[i], dl.colors[i]));
        }
        text.color = Color.white;
        if (dl.Close) Quad.SetActive(false);
    }
```