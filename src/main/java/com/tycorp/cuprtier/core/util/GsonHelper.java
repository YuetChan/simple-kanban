package com.tycorp.cuprtier.core.util;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

public class GsonHelper {
   public static Gson getPlainGson() { return new GsonBuilder().setPrettyPrinting().disableHtmlEscaping().create(); }
   public static Gson getExposeSensitiveGson() {
      return new GsonBuilder().excludeFieldsWithoutExposeAnnotation().create();
   }

   public static JsonObject decodeJsonStrForData(String jsonStr) {
      JsonObject json = GsonHelper.stringToJsonObject(jsonStr);
      JsonObject dataJson = GsonHelper.getDataJson(json);

      return dataJson;
   }
   public static JsonObject getDataJson(JsonObject json) { return json.get("data").getAsJsonObject(); }

   public static JsonObject stringToJsonObject(String string) {
      return new JsonParser().parse(string).getAsJsonObject();
   }

   public static JsonObject javaxToGsonJsonObject(javax.json.JsonObject json) {
      return JsonParser.parseString(json.toString()).getAsJsonObject();
   }
}
