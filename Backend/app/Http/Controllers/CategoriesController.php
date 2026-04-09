<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoriesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $categories = Category::withCount('listings')->get();

        return response()->json($categories);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'category_name' => 'required|string|max:255|unique:categories,category_name',
            'description' => 'nullable|string',
            'icon' => 'nullable|string|max:50',
            'is_popular' => 'nullable|boolean',
        ]);

        $category = Category::create([
            'category_name' => $request->category_name,
            'description' => $request->description,
            'icon' => $request->icon ?? 'fa-tag',
            'is_popular' => $request->is_popular ?? false,
        ]);

        return response()->json(['message' => 'Category created successfully', 'category' => $category], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $category = Category::findOrFail($id);

        return response()->json($category);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'category_name' => 'sometimes|string|max:255|unique:categories,category_name,'.$id.',category_id',
            'description' => 'sometimes|string',
            'icon' => 'sometimes|string|max:50',
            'is_popular' => 'sometimes|boolean',
        ]);

        $category = Category::findOrFail($id);
        $category->update($request->only(['category_name', 'description', 'icon', 'is_popular']));

        return response()->json(['message' => 'Category updated successfully', 'category' => $category]);
    }

    /**
     * Toggle the popular status of a category.
     */
    public function togglePopular($id)
    {
        $category = Category::findOrFail($id);
        $category->is_popular = !$category->is_popular;
        $category->save();

        return response()->json([
            'message' => 'Category popular status updated',
            'category' => $category,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $category = Category::findOrFail($id);
        $category->delete();

        return response()->json(['message' => 'Category deleted successfully']);
    }
}
